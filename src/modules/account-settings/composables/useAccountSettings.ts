import { reactive, ref } from 'vue'

export function useAccountSettings() {
  const isSaving = ref(false)

  // Company Information Form
  const companyForm = reactive({
    userName: 'Courtney',
    dotNumber: 'Henry',
    email: 'courtneyhenry@example.com',
    contactNumber: '233 234 234',
    streetAddress: '1234 Recovery Blvd',
    city: 'Nashville',
    state: 'TN',
    zipCode: '37201',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorSms: false,
    twoFactorApp: false
  })

  // Billing Input
  const billingEmail = ref('courtneyhenry@example.com')

  // General Settings
  const theme = ref('light')
  const timezone = ref('Pacific Time')
  const language = ref('English')
  const dateFormat = ref('dd/mm/yyyy')
  const timeFormat = ref('12 Hours')

  // Save logic
  const saveChanges = async () => {
    isSaving.value = true
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800))
    } finally {
      isSaving.value = false
    }
  }

  const discardChanges = () => {
    console.log('Changes discarded')
  }

  return {
    companyForm,
    billingEmail,
    theme,
    timezone,
    language,
    dateFormat,
    timeFormat,
    isSaving,
    saveChanges,
    discardChanges
  }
}
