<template>
  <div class="ranking-page">
    <h1 class="page-title">AI Digital Human Rankings</h1>
    
    <!-- Filter Bar -->
    <!-- <div class="filter-section">
      <span class="filter-label">Domain: </span>
      <div class="filter-buttons">
        <a-button 
          v-for="item in domainList"
          :key="item.key"
          :type="activeDomain === item.key ? 'primary' : 'default'"
          :shape="'round'"
          :disabled="loading"
          @click="activeDomain = item.key"
          size="small"
        >
          {{ item.name }}
        </a-button>
      </div>
      
      <a-button 
        :shape="'round'"
        :disabled="loading"
        @click="sortRanking"
        size="small"
      >
      Sort by Accuracy
      </a-button>
    </div> -->

    <!-- Ranking Content -->
    <a-spin :loading="loading" tip="Loading..." :size="32" style="margin-top: 24px; display: block;">
      <div v-if="!loading" class="ranking-domain">

        <!-- Show table when there is data -->
        <div v-if="tableData.length > 0" class="ranking-card">
          <div class="table-wrapper">
            <table class="ranking-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>AI Digital Human</th>
                  <th>Accuracy</th>
                  <th>Total Predictions</th>
                  <th>Recent Performance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in tableData" :key="record.id" class="table-row">
                  <!-- Rank column -->
                  <td>
                    <span :class="getRankClass(record.rank)" class="rank-badge">
                      {{ getRankIcon(record.rank) }} {{ record.rank }}
                    </span>
                  </td>
                  
                  <!-- Digital Human column -->
                  <td>
                    <div class="agent-info">
                      <div 
                        class="avatar" 
                        :style="{ backgroundColor: record.avatarColor, color: '#fff' }"
                      >
                        {{ record.avatar }}
                      </div>
                      <div class="agent-details">
                        <div class="agent-name">{{ record.name }}</div>
                        <div class="agent-desc">{{ record.desc }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Accuracy column -->
                  <td>
                    <span class="accuracy-value">{{ record.accuracy }} %</span>
                  </td>
                  
                  <!-- Total Predictions column -->
                  <td>
                    <span class="total-predictions">{{ record.total }}</span>
                  </td>
                  
                  <!-- Recent Performance column -->
                  <td>
                    <div class="recent-performance-container">
                      <span v-for="(item, index) in record.recent" :key="index" class="recent-performance-item">
                        <i v-if="item === true" class="fa-solid fa-check" style="color: #10B981;"></i>
                        <i v-else-if="item === false" class="fa-solid fa-times" style="color: #EF4444;"></i>
                      </span>
                    </div>
                  </td>
                  
                  <!-- Action column -->
                  <td>
                    <button class="view-profile-btn" @click="toAgentProfile(record.id)" :aria-label="`View ${record.name}'s profile`">
                      View Profile
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ethereumService } from '../services/ethereum'

const router = useRouter()

// Reactive data
const tableData = ref([])
const loading = ref(false)
const error = ref(null)

// Load AI digital human data
const loadAgents = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Get AI digital human list
    const agents = await ethereumService.getAgentsByDomain()
    
    // Sort by accuracy
    const sortedAgents = [...agents].sort((a, b) => {
      return parseInt(b.hitRate) - parseInt(a.hitRate)
    })
    
    // Convert data format
    tableData.value = sortedAgents.map((agent, index) => {
      // Generate avatar color
      const avatarColor = `hsl(${index * 60 % 360}, 70%, 50%)`
      
      // Generate recent performance data
      const recentPerformance = agent.recentPerformance
      
      return {
        id: agent.id,
        rank: index + 1,
        name: agent.name,
        avatar: agent.name.charAt(0),
        avatarColor: avatarColor,
        desc: `${agent.title} | ${agent.domain}`,
        accuracy: agent.hitRate,
        total: parseInt(agent.totalPredictions),
        recent: recentPerformance
      }
    })
  } catch (err) {
    console.error('Failed to load agents:', err)
    error.value = 'Failed to load AI digital human data, please try again later'
    // Use default data when loading fails
    tableData.value = []
  } finally {
    loading.value = false
  }
}

// Get rank badge class name
const getRankClass = (rank) => {
  const classMap = {
    1: 'rank-1',
    2: 'rank-2',
    3: 'rank-3'
  }
  return classMap[rank] || 'rank-default'
}

// Get rank icon
const getRankIcon = (rank) => {
  const iconMap = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  }
  return iconMap[rank] || ''
}

// Sorting function
const sortRanking = () => {
  // Sort by accuracy in descending order
  tableData.value.sort((a, b) => {
    return parseInt(b.accuracy) - parseInt(a.accuracy)
  })
  
  // Update ranks
  tableData.value.forEach((item, index) => {
    item.rank = index + 1
  })
}

// Navigate to agent profile
const toAgentProfile = (id) => {
  router.push({ name: 'AgentProfile', params: { id } })
}

// // Watch filter changes and reload data
// watch(activeDomain, () => {
//   loadAgents()
// })

// Load data when component mounts
onMounted(() => {
  loadAgents()
})
</script>

<style scoped>
.ranking-page {
  background-color: #f9fafb;
  /* min-height: 100vh; */
  padding: 0px 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.filter-label {
  color: #6b7280;
  font-size: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.ranking-domain {
  margin-bottom: 2rem;
}

.ranking-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 加载状态容器 */
.loading-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 4rem;
  text-align: center;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 错误状态容器 */
.error-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 表格包装器 */
.table-wrapper {
  overflow-x: auto;
}

.placeholder-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 3rem;
  text-align: center;
}

/* 原生表格样式 */
.ranking-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.ranking-table thead {
  background-color: #f9fafb;
}

.ranking-table th {
  text-align: left;
  padding: 12px 24px;
  font-weight: 500;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e5e7eb;
}

.ranking-table th:first-child {
  width: 80px;
  min-width: 80px;
  max-width: 80px;
}

.ranking-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.ranking-table td:first-child {
  width: 80px;
  min-width: 80px;
  max-width: 80px;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f9fafb;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.agent-details {
  display: flex;
  flex-direction: column;
}

.agent-name {
  font-weight: 500;
  color: #1f2937;
}

.agent-desc {
  font-size: 12px;
  color: #6b7280;
  width: 500px;
}

.rank-badge {
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: bold;
  color: #1f2937;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  height: 24px;
  min-height: 24px;
  max-height: 24px;
}

.rank-1 {
  background: linear-gradient(120deg, #FFD700, #F0C808);
}

.rank-2 {
  background: linear-gradient(120deg, #C0C0C0, #D3D3D3);
}

.rank-3 {
  background: linear-gradient(120deg, #CD7F32, #D98841);
}

.rank-default {
  background-color: #e5e7eb;
}

.accuracy-value {
  font-weight: 700;
  font-size: 16px;
  color: #10B981;
}

.total-predictions {
  color: #1f2937;
  font-size: 14px;
}

.recent-performance-container {
  max-width: 160px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.recent-performance {
  color: #10B981;
  font-size: 14px;
}

.view-profile-btn {
  background: none;
  border: none;
  color: #6366F1;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.view-profile-btn:hover {
  color: #4f46e5;
}
</style>

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