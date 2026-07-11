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

import {
  EMPTY_ADDRESS_DRAFT,
  SUPPORTED_LICENSE_FILE_TYPES,
} from '../config/profileForm.constants';
import {
  buildProfileFormData,
  buildProfileUpdatePayload,
  getLicenseFileName,
  getLicenseStatusMeta,
  toAddressDraft,
  validateProfileField,
  validateProfileForm,
} from '../utils/profileForm.utils';
import type {
  AddressDraft,
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

      const nextError = validateProfileField(field, value);
      if (!nextError) {
        return removeProfileFieldError(prev, field);
      }

      return { ...prev, [field]: nextError };
    });
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const field = e.target.id as ProfileFieldKey;
    const nextError = validateProfileField(field, e.target.value);

    setFormErrors((prev) => {
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
  };

  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  const triggerProfileValidation = useCallback(() => {
    const nextErrors = validateProfileForm({
      ...formData,
      liquorLicenseDocumentUrl:
        pendingLicenseFile?.name || formData.liquorLicenseDocumentUrl,
    });
    setFormErrors(nextErrors);
    return nextErrors;
  }, [formData, pendingLicenseFile]);

  useEffect(() => {
    if (validateParam !== '1') return;

    const nextErrors = triggerProfileValidation();
    const firstErrorField = Object.keys(nextErrors)[0];

    if (firstErrorField) {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(firstErrorField);
        target?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('validate');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams, triggerProfileValidation, validateParam]);

  const handleSaveProfile = async () => {
    const nextErrors = triggerProfileValidation();
    if (Object.keys(nextErrors).length > 0) {
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
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update profile';
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
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load license document';
      showToast(message, 'error');
    } finally {
      setIsViewingLicense(false);
    }
  };

  const handleStartAddAddress = () => {
    setAddressDraft({ ...EMPTY_ADDRESS_DRAFT });
    setIsAddressModalOpen(true);
  };

  const handleStartEditAddress = (address: Address) => {
    setAddressDraft(toAddressDraft(address));
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
      const message =
        error instanceof Error ? error.message : 'Failed to save address';
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
      const message =
        error instanceof Error ? error.message : 'Failed to delete address';
      showToast(message, 'error');
    }
  };

  return {
    addressDraft,
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
