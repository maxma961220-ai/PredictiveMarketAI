<template>
  <div class="event-detail-page">
    <!-- Back Button -->
  <a-button type="text" @click="router.back()" class="back-button">
    <icon-arrow-left /> Back to Event List
  </a-button>

  <!-- Loading State -->
  <a-spin :loading="loading" tip="Loading..." :size="32" class="loading-spin">
      <div v-if="!loading">
        <!-- Event Basic Information -->
        <a-card class="info-card">
          <a-space direction="vertical" fill>
            <!-- First Row: Title and Status -->
            <div class="info-header">
              <h1 class="event-title">{{ event.title }}</h1>
              <a-tag :color="event.status === 'active' ? 'green' : 'gray'">
                {{ event.status === 'active' ? 'In Progress' : 'Ended' }}
              </a-tag>
            </div>
            
            <!-- Second Row: Time and Probability -->
            <div class="info-footer">
              <div class="info-label">
                {{ event.status === 'active' ? 'Deadline: ' : 'End Time: ' }}{{ event.deadline }}
              </div>
              <div class="info-value-container">
                <span class="info-label">{{ event.status === 'active' ? 'Market Probability: ' : 'Final Result: ' }}</span>
                <span class="info-value">{{ event.market_probability }}</span>
              </div>
            </div>
          </a-space>
        </a-card>
    
        <!-- AI Prediction Summary -->
        <h2 class="section-title">AI Prediction Summary</h2>
        <a-card class="summary-card">
          <div class="summary-container">
            <!-- Chart -->
            <div ref="chartRef" class="chart-container"></div>
            
            <!-- Prediction Details -->
            <div class="prediction-detail">
              <div v-if="agentList.length > 0">
                <!-- Sort Toggle Buttons -->
                <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                  <a-button-group size="small">
                    <a-button 
                      :type="sortBy === 'votes' ? 'primary' : 'default'"
                      @click="sortBy = 'votes'"
                    >
                      Sort by Votes
                    </a-button>
                    <a-button 
                      :type="sortBy === 'accuracy' ? 'primary' : 'default'"
                      @click="sortBy = 'accuracy'"
                    >
                      Sort by Accuracy
                    </a-button>
                  </a-button-group>
                </div>
                
                <div class="space-y-4">
                  <div v-for="(range, index) in predictionRanges" :key="index" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background-color: #f9fafb; border-radius: 8px;">
                    <div style="display: flex; align-items: center;">
                      <div :style="{ backgroundColor: range.colorClass }" style="width: 16px; height: 16px; border-radius: 50%; margin-right: 12px;"></div>
                      <span style="font-weight: 500;">{{ range.range }}</span>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-weight: bold; font-size: 18px;">{{ range.votes }} Votes</div>
                      <div style="font-size: 12px; color: #666;">Weighted Accuracy: {{ range.weightedAccuracy }}%</div>
                    </div>
                  </div>
                  <div style="margin-top: 24px; padding: 16px; background-color: rgba(99, 102, 241, 0.1); border-radius: 8px; border: 1px solid rgba(99, 102, 241, 0.2);">
                    <div style="font-weight: bold; color: #6366F1; margin-bottom: 8px;">
                      <i class="fa fa-lightbulb-o mr-2"></i>Prediction Conclusion
                    </div>
                    <p style="color: #333;">
                      Based on the predictions from {{ showAllAgents ? agentList.length : 4 }} AI digital humans,
                      <span style="font-weight: bold;" :style="{ color: mostPredictedRange.colorClass }">{{ mostPredictedRange.range }}</span>
                      is the most recognized,
                      {{ predictionConclusion }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else style="text-align: center; padding: 40px 0;">
                <p style="color: #666;">No AI digital human prediction data available</p>
              </div>
            </div>
          </div>
        </a-card>
        
        <!-- AI Digital Human Prediction Summary -->
        <h2 class="section-title">AI Digital Human Prediction Summary</h2>
        <a-card class="summary-card" style="box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div class="overflow-x-auto">
            <a-table
              :data="showAllAgents ? agentList : agentList.slice(0, 4)"
              :hoverable="true"
              :bordered="{cell:true}"
              :pagination="false"
              style="width: 100%;"
            >
              <template #columns>
                <a-table-column title="AI Digital Human" data-index="agent" align="center" :width="200">
                  <template #cell="{ record }">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                      <div :style="{ backgroundColor: record.avatarColor }" style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold;">
                        {{ record.avatar }}
                      </div>
                      <span style="font-weight: 500;">{{ record.name }}</span>
                    </div>
                  </template>
                </a-table-column>
                
                <a-table-column title="Core Prediction" data-index="predict" align="center" :width="200">
                  <template #cell="{ record }">
                    <div class="result-tag" :style="getPredictStyle(record.predict)">
                      {{ record.predict }}
                    </div>
                  </template>
                </a-table-column>
                
                <a-table-column title="Historical Accuracy" data-index="accuracy" align="center" :width="200">
                  <template #cell="{ record }">
                    <div :style="{ color: getAccuracyColor(record.accuracy) }" style="text-align: center; font-weight: 500;">
                      {{ record.accuracy }}
                    </div>
                  </template>
                </a-table-column>
                
                <a-table-column title="Prediction Basis" data-index="reason" align="center">
                  <template #cell="{ record }">
                    <div style="text-align: center; font-size: 14px; color: #666;">{{ record.reason || 'Comprehensive Analysis' }}</div>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </div>
        </a-card>
        
        <!-- AI Digital Human Predictions -->
        <h2 class="section-title">AI Digital Human Predictions</h2>
        <a-grid :cols="2" :col-gap="24" :row-gap="24">
          <!-- Initially show first 4 cards -->
          <AgentCard 
            v-for="(agent, index) in (showAllAgents ? agentList : agentList.slice(0, 4))" 
            :key="agent.id"
            :agent="agent"
            @click="toAgentProfile(agent.id)"
          />
        </a-grid>
        
        <!-- Show More Button -->
        <div v-if="agentList.length > 4 && !showAllAgents" style="text-align: center; margin-top: 32px;">
          <a-button 
            type="primary" 
            size="large"
            style="border-radius: 20px; padding: 8px 32px;"
            @click="handleShowMore"
            :disabled="payModalVisible"
          >
            + Show More AI Digital Human Analyses
          </a-button>
        </div>
        
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
              <p style="margin-bottom: 24px; font-size: 16px;">To view the complete AI digital human analyses, you need to pay a fee of 0.1MON.</p>
              <p style="margin-bottom: 32px; font-size: 14px; color: #666;">After successful payment, you will be able to view all AI digital human prediction analyses.</p>
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
    </a-spin>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AgentCard from '../components/AgentCard.vue'
import { ethereumService } from '../services/ethereum'
import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()

// Reactive data
const event = ref({})
const agentList = ref([])
const loading = ref(false)
const error = ref(null)
const chartRef = ref(null)
const chartInstance = ref(null)
const sortBy = ref('votes') // 'votes' or 'accuracy'

// Show all agents control
const showAllAgents = ref(false)

// Payment modal control (for showing more AI digital human analyses)
const payModalVisible = ref(false)
const payModalLoading = ref(false)
const payModalError = ref('')
const payModalErrorDetail = ref('')

// Load event details
const loadEvent = async () => {
  const eventId = route.params.id
  if (!eventId) return
  
  try {
    const eventData = await ethereumService.getEvent(Number(eventId))
    event.value = {
      id: eventData.id,
      title: eventData.title,
      status: eventData.active === 1 ? 'active' : 'ended',
      marketProb: eventData.sub_markets && eventData.sub_markets.length > 0 ? `${(parseFloat(eventData.sub_markets[0].outcome_prices[0]) * 100).toFixed(2)}%` : '50%',
      result: eventData.closed === 1 ? 'Yes' : 'No',
      deadline: eventData.end_date,
      market_probability:eventData.market_probability

    }
  } catch (err) {
    console.error('Failed to load event:', err)
    error.value = 'Failed to load event details, showing default data'
  }
}

// Load AI digital human predictions
const loadPredictions = async () => {
  const eventId = route.params.id
  if (!eventId) return
  
  try {
    const predictions = await ethereumService.getEventPredictions(eventId)
    // Convert data format and deduplicate (by agentId)
    const agentMap = new Map()
    
    for (const prediction of predictions) {
      if (!agentMap.has(prediction.agentId)) {
        try {
          const agent = await ethereumService.getAgent(prediction.agentId)
          agentMap.set(prediction.agentId, {
            id: agent.id,
            name: agent.name,
            avatar: agent.name.charAt(0),
            avatarColor: `hsl(${parseInt(agent.id) * 60 % 360}, 70%, 50%)`,
            desc: `${agent.title} | ${agent.domain}`,
            predict: prediction.predictResult, // Only store prediction result
            predictProbability: `${prediction.predictProbability}%`, // Store probability separately
            predictColor: prediction.predictResult === 'Yes' ? 'green' : 'red',
            reason: prediction.reason,
            coreConclusion: prediction.coreConclusion,
            accuracy: `${agent.hitRate}%`,
            rank: 0, // Can calculate rank if needed
            domain: agent.domain
          })
        } catch (err) {
          console.error(`Failed to load agent ${prediction.agentId}:`, err)
        }
      }
    }
    agentList.value = Array.from(agentMap.values())
  } catch (err) {
    console.error('Failed to load predictions:', err)
    error.value = 'Failed to load AI digital human predictions, showing default data'
    // Use default data when loading fails
    agentList.value = []
  }
}

// Load all data
const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    await Promise.all([
      loadEvent(),
      loadPredictions()
    ])
  } catch (err) {
    console.error('Failed to load data:', err)
    error.value = 'Failed to load data, please check default data'
    
  
  }
  finally {
    loading.value = false
  }
}

// Navigate to agent profile
const toAgentProfile = (id) => {
  router.push({ name: 'AgentProfile', params: { id } })
}

// Calculate prediction statistics
const getPredictionStats = () => {
  const list = showAllAgents.value ? agentList.value : agentList.value.slice(0, 4)
  const yesCount = list.filter(agent => agent.predict.includes('Yes')).length
  const noCount = list.filter(agent => agent.predict.includes('No')).length
  const total = yesCount + noCount
  
  return {
    yesCount,
    noCount,
    total,
    yesPercentage: total > 0 ? Math.round((yesCount / total) * 100) : 0,
    noPercentage: total > 0 ? Math.round((noCount / total) * 100) : 0
  }
}

// Computed properties
const mostPredictedRange = computed(() => {
  if (agentList.value.length === 0) return 'No data available'
  
  const list = showAllAgents.value ? agentList.value : agentList.value.slice(0, 4)
  const rangeCounts = {}
  list.forEach(agent => {
    const range = agent.predict
    rangeCounts[range] = (rangeCounts[range] || 0) + 1
  })
  
  let maxCount = 0
  let mostRange = ''
  Object.entries(rangeCounts).forEach(([range, count]) => {
    if (count > maxCount) {
      maxCount = count
      mostRange = range
    }
  })
  
  return {
    range: mostRange,
    count: maxCount,
    colorClass: mostRange === 'Yes' ? 'green' : 'red'
  }
})

const predictionConclusion = computed(() => {
  if (agentList.value.length === 0) return 'No prediction data available'
  
  // First get prediction result distribution and supporting AIs
  const rangeGroups = {}
  const list = showAllAgents.value ? agentList.value : agentList.value.slice(0, 4)
  list.forEach(agent => {
    const range = agent.predict
    if (!rangeGroups[range]) {
      rangeGroups[range] = {
        count: 0,
        agents: []
      }
    }
    rangeGroups[range].count += 1
    rangeGroups[range].agents.push(agent.name)
  })
  
  // Sort prediction results
  const sortedRanges = Object.entries(rangeGroups)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([range, data]) => ({ range, ...data }))
  
  if (sortedRanges.length === 0) return 'No prediction data available'
  
  const firstRange = sortedRanges[0]
  const firstAgents = firstRange.agents.join(', ')
  
  if (sortedRanges.length === 1) {
    return `All AI digital humans (${firstAgents}) predict ${firstRange.range}.`
  } else {
    // Generate text for secondary prediction results
    const otherRanges = sortedRanges.slice(1).map(item => {
      return `${item.range} (${item.agents.join(', ')})`
    }).join(' and ')
    
    let conclusion = `Supported by ${firstRange.count} AIs including ${firstAgents}, followed by ${otherRanges}.`
    
    // Generate corresponding conclusion based on prediction result type
    if (firstRange.range === 'Yes' || firstRange.range === 'No') {
      // Conclusion for Yes/No predictions
      conclusion += ` Based on historical accuracy, the probability of ${firstRange.range} is high.`
    } else {
      // General conclusion for other types of predictions
      conclusion += ` Based on historical accuracy, this prediction result has high credibility.`
    }
    
    return conclusion
  }
})

const predictionRanges = computed(() => {
  // Create a Map to store different prediction results
  const rangeMap = new Map()
  const list = showAllAgents.value ? agentList.value : agentList.value.slice(0, 4)
  // Iterate through all AI digital human predictions
  list.forEach(agent => {
    // Ensure agent and predict properties exist
    if (!agent || !agent.predict) return
    
    // Extract prediction result and standardize
    const range = agent.predict.toString().trim()
    
    // Ensure result is not empty
    if (!range) return
    
    // If this result doesn't exist yet, initialize it
    if (!rangeMap.has(range)) {
      rangeMap.set(range, {
        range: range,
        votes: 0,
        totalAccuracy: 0,
        agents: [],
        colorClass: getRangeColorClass(range)
      })
    }
    
    // Get current result data
    const rangeData = rangeMap.get(range)
    
    // Accumulate vote count
    rangeData.votes += 1
    
    // Accumulate accuracy
    if (agent.accuracy) {
      const acc = parseInt(agent.accuracy.toString().replace('%', ''))
      if (!isNaN(acc)) {
        rangeData.totalAccuracy += acc
      }
    }
    
    // Add AI digital human supporting this result
    if (agent.name) {
      rangeData.agents.push(agent.name)
    }
  })
  
  // Convert to array and calculate weighted accuracy
  const rangesArray = Array.from(rangeMap.values()).map(data => ({
    ...data,
    weightedAccuracy: data.votes > 0 ? Math.round(data.totalAccuracy / data.votes) : 0
  }))
  
  // Determine sorting method based on sortBy value
  if (sortBy.value === 'votes') {
    // Sort by vote count in descending order
    rangesArray.sort((a, b) => b.votes - a.votes)
  } else {
    // Sort by weighted accuracy in descending order
    rangesArray.sort((a, b) => b.weightedAccuracy - a.weightedAccuracy)
  }
  
  return rangesArray
})

// Utility functions
const getRangeColorClass = (range) => {
  if (range.includes('Yes')) return '#10B981'
  if (range.includes('No')) return '#EF4444'
  return '#EF4444'
}

// Get color based on accuracy
const getAccuracyColor = (accuracy) => {
  const acc = parseInt(accuracy)
  if (acc >= 80) return '#10b981' // Green
  if (acc >= 60) return '#3b82f6' // Blue
  if (acc >= 30) return '#f97316' // Orange
  return '#ef4444' // Red
}

// Get style based on prediction result
const getPredictStyle = (predict) => {
  // Polygon clipping effect
  const clipPath = 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)'
  
  // Return different background and text colors based on prediction result
  if (predict.includes('Yes')) {
    return {
      backgroundColor: '#f0fdf4',
      color: '#10b981',
      clipPath: clipPath,
      padding: '8px 16px',
      textAlign: 'center',
      fontWeight: 'bold'
    }
  } else if (predict.includes('No')) {
    return {
      backgroundColor: '#fef2f2',
      color: '#ef4444',
      clipPath: clipPath,
      padding: '8px 16px',
      textAlign: 'center',
      fontWeight: 'bold'
    }
  } else {
    return {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      clipPath: clipPath,
      padding: '8px 16px',
      textAlign: 'center',
      fontWeight: 'bold'
    }
  }
}

// Initialize chart
const initChart = () => {
  if (!chartRef.value) return
  
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  
  chartInstance.value = echarts.init(chartRef.value)
  
  const stats = getPredictionStats()
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    series: [
      {
        name: 'AI Predictions',
        type: 'pie',
        radius: ['50%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: stats.yesCount, name: 'Yes', itemStyle: { color: '#10B981' } },
          { value: stats.noCount, name: 'No', itemStyle: { color: '#EF4444' } }
        ]
      }
    ]
  }
  
  chartInstance.value.setOption(option)
}

// Watch agentList changes and re-render chart
watch(agentList, () => {
  setTimeout(() => {
    initChart()
  }, 50)
}, { deep: true })

// Handle window resize
const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}



// Handle showing more AI digital human analyses
const handleShowMore = () => {
  // Open payment modal
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
      // Payment successful, show all cards and close modal
      showAllAgents.value = true
      payModalVisible.value = false
      setTimeout(() => {
        // Reload data
        initChart()
      }, 1000)
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
}

// Initialize when component mounts
onMounted(() => {
  // Load data directly, bypass payment verification
  loadData()
  window.addEventListener('resize', handleResize)
})

// Clean up when component unmounts
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
})
</script>

<style scoped>
.event-detail-page {
  padding: 24px 16px;
  color: #6366F1;
}

/* 返回按钮 */
.back-button {
  margin-bottom: 16px;
  color: #6366F1;
}

/* 加载状态 */
.loading-spin {
  margin-top: 24px;
  display: block;
}

/* 信息卡片 */
.info-card {
  margin-bottom: 24px;
}

/* 信息头部 */
.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 事件标题 */
.event-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

/* 信息底部 */
.info-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

/* 信息标签 */
.info-label {
  color: #666;
}

/* 信息值容器 */
.info-value-container {
  font-size: 16px;
}

/* 信息值 */
.info-value {
  font-weight: bold;
}

/* 标题样式 */
.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

/* 总结卡片样式 */
.summary-card {
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* 总结容器布局 */
.summary-container {
  display: flex;
  justify-content: space-between;
}

/* 图表容器 */
.chart-container {
  width: 400px;
  height: 400px;
}

/* 预测详情容器 */
.prediction-detail {
  flex: 1;
  margin-top: 40px;
}

/* YES 相关样式 */
.yes-title {
  color: #10B981;
}

.yes-probability {
  font-weight: bold;
  color: #10B981;
}

/* NO 相关样式 */
.no-title {
  color: #EF4444;
}

.no-probability {
  font-weight: bold;
  color: #EF4444;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 20px 0;
  color: #666;
}

.overall-empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-text {
  color: #666;
}

/* Result tag styles */
.result-tag {
  clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
  -webkit-clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
  -moz-clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
  -ms-clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
  padding: 8px 16px;
  text-align: center;
  font-weight: bold;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}
</style>