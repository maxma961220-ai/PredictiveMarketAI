<template>
  <div>
    <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 24px;">AI Digital Human Prediction Events</h1>
    
    <!-- Filter Bar -->
    <!-- <a-space wrap style="margin-bottom: 24px;"> -->
      <div style="margin-bottom: 16px;">  
        <span style="color: #666;">Domain: </span>
        <a-button
          style="margin-right: 8px;"
          v-for="item in domainList" 
          :key="item.key"
          :type="activeDomain === item.key ? 'primary' : 'default'"
          :disabled="loading"
          @click="activeDomain = item.key"
        >
          {{ item.name }}
        </a-button>
      </div>
      <div style="margin-bottom: 16px;">
        <span style="color: #666;">Status: </span>
        <a-button
          style="margin-right: 8px;"
          :type="activeStatus === 'all' ? 'primary' : 'default'"
          :disabled="loading"
          @click="activeStatus = 'all'"
        >
          All
        </a-button>
        <a-button 
          style="margin-right: 8px;"
          :type="activeStatus === 'active' ? 'primary' : 'default'"
          :disabled="loading"
          @click="activeStatus = 'active'"
        >
          In Progress
        </a-button>
        <a-button 
          style="margin-right: 8px;"
          :type="activeStatus === 'ended' ? 'primary' : 'default'"
          :disabled="loading"
          @click="activeStatus = 'ended'"
        >
          Ended
        </a-button>
      </div>
    <!-- </a-space> -->

    <!-- Event List -->
    <a-spin :loading="loading" tip="Loading..." :size="32" style="margin-top: 24px; display: block;">
      <div v-if="!loading">
        <a-grid :cols="3" :col-gap="24" :row-gap="24">
          <EventCard 
            v-for="event in eventList" 
            :key="event.id"
            :event="event"
            @click="toEventDetail(event.id)"
          />
        </a-grid>
      </div>
    </a-spin>
    
    <!-- Payment Modal -->
    <a-modal
      v-model:visible="payModalVisible"
      title="Payment"
      :footer="null"
      :mask-closable="false"
    >
      <div style="padding: 20px 0;">
        <!-- Modal Loading State -->
        <div v-if="payModalLoading" style="text-align: center; padding: 40px 0;">
          <a-spin tip="Processing payment..." :size="24">
            <div style="padding: 20px 0;">
              <p>Processing 0.1MON payment, please wait...</p>
            </div>
          </a-spin>
        </div>
        
        <!-- Modal Error State -->
        <div v-else-if="payModalError" style="padding: 20px 0;">
          <div style="padding: 16px; background-color: #fff1f0; border: 1px solid #ffccc7; border-radius: 8px; color: #cf1322; display: flex; align-items: center; margin-bottom: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="margin-right: 12px; font-size: 20px; flex-shrink: 0; display: flex; align-items: center;">⚠️</div>
            <div style="font-size: 14px; line-height: 1.5; display: flex; align-items: center;">{{ payModalError || 'Payment failed, please try again' }}</div>
          </div>
          <div v-if="payModalErrorDetail" style="margin-bottom: 24px; font-size: 14px; color: #666;">
            {{ payModalErrorDetail }}
          </div>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <a-button @click="closePayModal">
              Cancel
            </a-button>
            <a-button type="primary" @click="handleModalPay">
              Retry Payment
            </a-button>
          </div>
        </div>
        
        <!-- Modal Default State -->
        <div v-else>
          <p style="margin-bottom: 24px; font-size: 16px;">To access event details, you need to pay a fee of 0.1MON.</p>
          <p style="margin-bottom: 32px; font-size: 14px; color: #666;">After successful payment, you will be able to view the complete event details and AI digital human analyses.</p>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <a-button @click="closePayModal">
              Cancel
            </a-button>
            <a-button type="primary" @click="handleModalPay">
              Pay 0.1MON Fee
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import EventCard from '../components/EventCard.vue'
import { ethereumService } from '../services/ethereum'

const router = useRouter()
// Domain filter
const domainList = [
  { key: 'all', name: 'All' },
  { key: 'crypto', name: 'Crypto' },
  { key: 'courts', name: 'Legal' },
  { key: 'politics', name: 'Politics' },
  { key: 'economy', name: 'Economy' },
  { key: 'sports', name: 'Sports' },
  { key: 'technology', name: 'Technology' },
  { key: 'healthcare', name: 'Healthcare' },
  { key: 'climate', name: 'Climate' },
  { key: 'entertainment', name: 'Entertainment' }
]
const activeDomain = ref('all')
// Status filter
const activeStatus = ref('all')

// Event list data
const eventList = ref([])
const loading = ref(false)
const error = ref(null)

// Payment modal control
const payModalVisible = ref(false)
const payModalLoading = ref(false)
const payModalError = ref('')
const payModalErrorDetail = ref('')
const targetEventId = ref(null)

// Load event data
const loadEvents = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Prepare parameters: empty string for all domains, status code 0 for all statuses
    const domain = activeDomain.value === 'all' ? '' : activeDomain.value
    const status = activeStatus.value === 'all' ? 0 : (activeStatus.value === 'active' ? 1 : 2)
    
    // Directly get event list
    const events = await ethereumService.getEvents(domain, status)
    // Convert event data format to match EventCard component expectations
    eventList.value = events.map(event => ({
      id: event.id,
      title: event.title,
      domain: event.main_category || 'Crypto', // Default domain
      status: event.active === 1 ? 'active' : 'ended',
      marketProb: '50%', // Get probability from sub-markets
      result: event.market_probability, // Determine result based on closed field
      deadline: event.end_date || event.close_date || 'N/A', // Prioritize close_date, fallback to end_date
      market_probability: event.market_probability || 'N/A' // Get probability from sub-markets
    }))
  } catch (err) {
    console.error('Failed to load events:', err)
    error.value = 'Failed to load events, please try again later'
    // Use default data when loading fails
    eventList.value = []
  } finally {
    loading.value = false
  }
}

// Navigate to event detail
const toEventDetail = (id) => {
  // Open payment modal and set target event ID
  targetEventId.value = id
  payModalVisible.value = true
  payModalError.value = ''
  payModalErrorDetail.value = ''
}

// Handle payment logic in modal
const handleModalPay = async () => {
  try {
    payModalLoading.value = true
    payModalError.value = ''
    payModalErrorDetail.value = ''
    
    // Call ethereum service's payFee method
    const result = await ethereumService.payFee()
        
    if (result.success) {
      // Payment successful, navigate to detail page and close modal
      payModalVisible.value = false
      router.push({ name: 'EventDetail', params: { id: targetEventId.value } })
    } else {
      // Payment failed, show error message in modal
      // Ensure payModalError has a value
      if (result.error) {
        payModalError.value = result.error
      } else if (result.message) {
        payModalError.value = result.message
      } else {
        payModalError.value = 'Payment failed, please try again'
      }
      payModalErrorDetail.value = 'Please check your wallet balance and network connection'
    }
  } catch (err) {
    console.error('Error during payment:', err)
    if (err.message) {
      payModalError.value = err.message
    } else if (err.error) {
      payModalError.value = err.error
    } else {
      payModalError.value = 'Error during payment, please try again'
    }
    payModalErrorDetail.value = 'Error details: ' + (err.message || JSON.stringify(err))
  } finally {
    payModalLoading.value = false
  }
}

// Close payment modal
const closePayModal = () => {
  payModalVisible.value = false
  payModalError.value = ''
  payModalErrorDetail.value = ''
  targetEventId.value = null
}

// Watch filter changes and reload data
watch([activeDomain, activeStatus], () => {
  loadEvents()
})

// Load data when component mounts
onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
/* 确保选中的按钮使用正确的主题色 */
:deep(.arco-btn-primary) {
  background-color: #6366F1 !important;
  border-color: #6366F1 !important;
  border: none !important;
  padding: 8px 16px !important;
  min-width: 64px !important;
  box-sizing: border-box !important;
}

:deep(.arco-btn-primary:hover) {
  background-color: #4f46e5 !important;
  border-color: #4f46e5 !important;
  border: none !important;
  padding: 8px 16px !important;
  min-width: 64px !important;
  box-sizing: border-box !important;
}
</style>