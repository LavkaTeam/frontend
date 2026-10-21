import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import {
  addUserAddress,
  deleteUserAddress,
  getUserLicenseDocument,
  updateUser,
  updateUserAddress,
  uploadUserFile,
} from '@/api/user';
import { useToast } from '@/hooks/useToast';
import type { Address, UserResponse } from '@/types/user';
import { extractErrorMessage } from '@/utils/error';

import {
  EMPTY_ADDRESS_DRAFT,
  SUPPORTED_LICENSE_FILE_TYPES,
} from '../config/profileForm.constants';
import {
  buildProfileFormData,
  buildProfileUpdatePayload,
  getLicenseFileName,
  getLicenseStatusMeta,
  getMissingProfileFields,
  getAddressFieldErrors,
  getProfileFieldErrors,
  validateAddressDraft,
  toAddressDraft,
  validateProfileField,
  validateProfileForm,
} from '../utils/profileForm.utils';
import { ADDRESS_FIELD_RULES, getFieldFormatError } from '../utils/fieldRules';
import type {
  AddressDraft,
  AddressFormErrors,
  ProfileFieldKey,
  ProfileFormErrors,
} from '../types/profileForm.types';

const removeProfileFieldError = (
  errors: ProfileFormErrors,
  field: ProfileFieldKey,
) => {
  const nextErrors = { ...errors };
  delete nextErrors[field];

  return nextErrors;
};

const useAccountProfileForm = (user: UserResponse) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toasts, showToast, removeToast } = useToast();

  const initialFormData = useMemo(() => buildProfileFormData(user), [user]);

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({});
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>(
    user.shippingAddresses || [],
  );
  const [addressDraft, setAddressDraft] = useState<AddressDraft | null>(null);
  const [addressErrors, setAddressErrors] = useState<AddressFormErrors>({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isViewingLicense, setIsViewingLicense] = useState(false);
  const [pendingLicenseFile, setPendingLicenseFile] = useState<File | null>(
    null,
  );

  const validateParam = searchParams.get('validate');
  const openLogoParam = searchParams.get('openLogo');
  const verificationStatus = user.verificationStatus || user.status;

  const licenseInputRef = useRef<HTMLInputElement>(null);
  const isProfileDirty =
    pendingLicenseFile !== null ||
    JSON.stringify(formData) !== JSON.stringify(initialFormData);
  const licenseFileName = getLicenseFileName(
    pendingLicenseFile,
    formData.liquorLicenseDocumentUrl,
  );
  // Same list the backend uses to move NOT_VERIFIED → PENDING on save.
  const missingRequiredFields = getMissingProfileFields({
    ...formData,
    // A picked but not yet uploaded license file counts as filled.
    liquorLicenseDocumentUrl:
      pendingLicenseFile?.name || formData.liquorLicenseDocumentUrl,
  });
  const licenseStatus = getLicenseStatusMeta(
    verificationStatus,
    Boolean(formData.liquorLicenseDocumentUrl),
    Boolean(pendingLicenseFile),
  );

  useEffect(() => {
    setFormData(initialFormData);
    setShippingAddresses(user.shippingAddresses || []);
    setFormErrors({});
    setPendingLicenseFile(null);
  }, [initialFormData, user.shippingAddresses]);

  useEffect(() => {
    if (openLogoParam !== '1') return;

    setIsLogoModalOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('openLogo');
    setSearchParams(nextParams, { replace: true });
  }, [openLogoParam, searchParams, setSearchParams]);

  const clearFieldError = (field: ProfileFieldKey) => {
    setFormErrors((prev) => {
      if (!prev[field]) return prev;

      return removeProfileFieldError(prev, field);
    });
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const field = id as ProfileFieldKey;

    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => {
      if (!prev[field]) return prev;

      // A field already flagged as missing keeps the "required" check.
      const nextError = validateProfileField(field, value, {
        requireFilled: true,
      });
      if (!nextError) {
        return removeProfileFieldError(prev, field);
      }

      return { ...prev, [field]: nextError };
    });
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const field = e.target.id as ProfileFieldKey;

    setFormErrors((prev) => {
      const nextError = validateProfileField(field, e.target.value, {
        requireFilled: Boolean(prev[field]),
      });

      if (!nextError) {
        if (!prev[field]) return prev;

        return removeProfileFieldError(prev, field);
      }

      return { ...prev, [field]: nextError };
    });
  };

  const handleAddressFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddressDraft((prev) => (prev ? { ...prev, [id]: value } : prev));
    // Re-check a field that already shows an error, so it clears as it is fixed.
    setAddressErrors((prev) => {
      if (!prev[id as keyof AddressDraft]) return prev;

      const nextErrors = { ...prev };
      const error = getFieldFormatError(ADDRESS_FIELD_RULES, id, value);
      if (error) nextErrors[id as keyof AddressDraft] = error;
      else delete nextErrors[id as keyof AddressDraft];

      return nextErrors;
    });
  };

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  const triggerProfileValidation = useCallback(
    (requireFilled: boolean) => {
      const nextErrors = validateProfileForm(
        {
          ...formData,
          liquorLicenseDocumentUrl:
            pendingLicenseFile?.name || formData.liquorLicenseDocumentUrl,
        },
        { requireFilled },
      );
      setFormErrors(nextErrors);
      return nextErrors;
    },
    [formData, pendingLicenseFile],
  );

  // Scrolls to the topmost of the given fields as they appear on the page
  // (not in data order) and focuses it, so the user can type right away.
  const scrollToFirstField = (fields: string[]) => {
    window.requestAnimationFrame(() => {
      const target = fields
        .map((field) => document.getElementById(field))
        .filter((element): element is HTMLElement => element !== null)
        .sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        )[0];
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input =
        target instanceof HTMLInputElement
          ? target
          : target.querySelector<HTMLElement>('input, button, [tabindex]');
      input?.focus({ preventScroll: true });
    });
  };

  // Highlights every invalid or missing field and scrolls to the first one.
  const showMissingFields = useCallback(() => {
    const nextErrors = triggerProfileValidation(true);
    scrollToFirstField(Object.keys(nextErrors));
  }, [triggerProfileValidation]);

  useEffect(() => {
    if (validateParam !== '1') return;

    showMissingFields();

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('validate');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams, showMissingFields, validateParam]);

  const handleSaveProfile = async () => {
    // Only format errors block saving; missing fields are allowed.
    const nextErrors = triggerProfileValidation(false);
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstField(Object.keys(nextErrors));
      return;
    }

    setIsSavingProfile(true);
    try {
      let liquorLicenseDocumentUrl = formData.liquorLicenseDocumentUrl;

      if (pendingLicenseFile) {
        liquorLicenseDocumentUrl = await uploadUserFile(
          pendingLicenseFile,
          'license',
        );
      }

      await updateUser(
        user.id,
        buildProfileUpdatePayload(user, formData, {
          liquorLicenseDocumentUrl,
        }),
      );

      setFormData((prev) => ({
        ...prev,
        liquorLicenseDocumentUrl,
      }));
      setPendingLicenseFile(null);
      await invalidateUser();
      showToast(
        missingRequiredFields.length > 0
          ? `Profile saved. Fill in ${missingRequiredFields.length} more required details to send it for review.`
          : 'Profile updated successfully',
        'success',
      );
    } catch (error) {
      // 400: {"<field>": "<message>"}, legal address keys as legalAddress.*
      const fieldErrors = getProfileFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        setFormErrors(fieldErrors);
        scrollToFirstField(Object.keys(fieldErrors));
        return;
      }

      const message = extractErrorMessage(error, 'Failed to update profile');
      showToast(message, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogoUpload = async (croppedBlob: Blob) => {
    const uploadedUrl = await uploadUserFile(croppedBlob, 'logos');
    const nextFormData = { ...formData, logoUrl: uploadedUrl };

    setFormData(nextFormData);

    await updateUser(
      user.id,
      buildProfileUpdatePayload(user, nextFormData, {
        logoUrl: uploadedUrl,
      }),
    );

    await invalidateUser();
    showToast('Logo uploaded successfully', 'success');
  };

  const handleLicenseUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!SUPPORTED_LICENSE_FILE_TYPES.includes(file.type)) {
      setFormErrors((prev) => ({
        ...prev,
        liquorLicenseDocumentUrl:
          'Upload a PDF, JPG, or PNG file for the license.',
      }));
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        liquorLicenseDocumentUrl: 'File is too large. Maximum size is 10 MB.',
      }));
      event.target.value = '';
      return;
    }

    setPendingLicenseFile(file);
    clearFieldError('liquorLicenseDocumentUrl');
    if (licenseInputRef.current) {
      licenseInputRef.current.value = '';
    }
  };

  const handleViewLicense = async () => {
    if (!formData.liquorLicenseDocumentUrl || pendingLicenseFile) return;

    setIsViewingLicense(true);
    try {
      const blob = await getUserLicenseDocument();
      const fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 10000);
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to load license document');
      showToast(message, 'error');
    } finally {
      setIsViewingLicense(false);
    }
  };

  const handleStartAddAddress = () => {
    setAddressDraft({ ...EMPTY_ADDRESS_DRAFT });
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  const handleStartEditAddress = (address: Address) => {
    setAddressDraft(toAddressDraft(address));
    setAddressErrors({});
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleAddressModalExited = () => {
    setAddressDraft(null);
  };

  const handleSaveAddress = async () => {
    if (!addressDraft) return;

    const formatErrors = validateAddressDraft(addressDraft);
    setAddressErrors(formatErrors);
    if (Object.keys(formatErrors).length > 0) return;

    setIsSavingAddress(true);
    try {
      const payload = {
        title: addressDraft.title,
        country: addressDraft.country,
        city: addressDraft.city,
        street: addressDraft.street,
        zipCode: addressDraft.zipCode,
        recipientName: addressDraft.recipientName,
        recipientPhone: addressDraft.recipientPhone,
        deliveryNotes: addressDraft.deliveryNotes,
      };

      const savedAddress = addressDraft.id
        ? await updateUserAddress(addressDraft.id, payload)
        : await addUserAddress(payload);

      setShippingAddresses((prev) => {
        if (addressDraft.id) {
          return prev.map((item) =>
            item.id === savedAddress.id ? savedAddress : item,
          );
        }

        return [...prev, savedAddress];
      });

      setIsAddressModalOpen(false);
      await invalidateUser();
      showToast(
        addressDraft.id ? 'Delivery address updated' : 'Delivery address added',
        'success',
      );
    } catch (error) {
      const fieldErrors = getAddressFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        setAddressErrors(fieldErrors);
        return;
      }

      const message = extractErrorMessage(error, 'Failed to save address');
      showToast(message, 'error');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleRequestDeleteAddress = (address: Address) => {
    setAddressToDelete(address);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete?.id) return;

    try {
      await deleteUserAddress(addressToDelete.id);
      setShippingAddresses((prev) =>
        prev.filter((address) => address.id !== addressToDelete.id),
      );
      setAddressToDelete(null);
      await invalidateUser();
      showToast('Delivery address removed', 'success');
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to delete address');
      showToast(message, 'error');
    }
  };

  return {
    verificationStatus,
    missingRequiredFields,
    showMissingFields,
    addressDraft,
    addressErrors,
    addressToDelete,
    formData,
    formErrors,
    isAddressModalOpen,
    isLogoModalOpen,
    isPasswordModalOpen,
    isProfileDirty,
    isSavingAddress,
    isSavingProfile,
    isViewingLicense,
    licenseFileName,
    licenseInputRef,
    licenseStatus,
    pendingLicenseFile,
    shippingAddresses,
    toasts,
    handleAddressFieldChange,
    handleAddressModalExited,
    handleCloseAddressModal,
    handleDeleteAddress,
    handleFieldBlur,
    handleFieldChange,
    handleLicenseUpload,
    handleLogoUpload,
    handleRequestDeleteAddress,
    handleSaveAddress,
    handleSaveProfile,
    handleStartAddAddress,
    handleStartEditAddress,
    handleViewLicense,
    removeToast,
    setAddressToDelete,
    setIsLogoModalOpen,
    setIsPasswordModalOpen,
  };
};

export { useAccountProfileForm };
