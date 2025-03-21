/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/wx/index.d.ts" />

// const app = getApp<IAppOption>();
import appInstance from '../../app';

interface EnhancedFoodRecord extends FoodRecord {
  date: string;
  time: string;
  userHealthOpinionText: string;
  userHealthOpinionClass: string;
}

Page({
  data: {
    foodRecords: [] as EnhancedFoodRecord[]
  },

  onLoad() {
    console.log('History page loaded');
  },

  onShow() {
    console.log('History page shown');
    this.loadFoodRecords();
  },

  loadFoodRecords() {
    console.log('Loading food records from global data');
    const globalRecords = appInstance.globalData.foodHistory || [];
    
    if (globalRecords.length === 0) {
      console.log('No food records found');
      this.setData({
        foodRecords: []
      });
      return;
    }
    
    // Group records by date
    const groupedRecords: Record<string, EnhancedFoodRecord[]> = {};
    
    // Transform records with formatting
    const enhancedRecords = globalRecords.map(record => {
      const date = new Date(record.timestamp);
      const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      let opinionText = '不确定';
      let opinionClass = 'unknown';
      
      if (record.userHealthOpinion === 'healthy') {
        opinionText = '健康';
        opinionClass = 'healthy';
      } else if (record.userHealthOpinion === 'unhealthy') {
        opinionText = '不健康';
        opinionClass = 'unhealthy';
      }
      
      const enhancedRecord: EnhancedFoodRecord = {
        ...record as FoodRecord,
        date: dateStr,
        time: timeStr,
        userHealthOpinionText: opinionText,
        userHealthOpinionClass: opinionClass
      };
      
      if (!groupedRecords[dateStr]) {
        groupedRecords[dateStr] = [];
      }
      
      groupedRecords[dateStr].push(enhancedRecord);
      return enhancedRecord;
    });
    
    // Sort records by date (newest first) and flatten
    const sortedDates = Object.keys(groupedRecords).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const displayRecords: EnhancedFoodRecord[] = [];
    sortedDates.forEach(date => {
      const recordsForDate = groupedRecords[date];
      // Add a date header record
      recordsForDate.sort((a, b) => b.timestamp - a.timestamp);
      displayRecords.push(...recordsForDate);
    });
    
    console.log('Processed food records:', displayRecords);
    
    this.setData({
      foodRecords: displayRecords
    });
  },

  onViewRecord(event: any) {
    const recordId = event.currentTarget.dataset.id;
    console.log('Viewing record details:', recordId);
    
    // In a full implementation, we would navigate to a detail page
    // For this demo, just show a toast
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  onTakePhoto() {
    console.log('User clicked take photo button');
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
}); 