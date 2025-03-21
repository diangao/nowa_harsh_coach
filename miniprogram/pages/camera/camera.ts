/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/wx/index.d.ts" />

import appInstance from '../../app';

Page({
  data: {
    imageTaken: false,
    tempImagePath: '',
    isUploading: false
  },

  onLoad() {
    console.log('Camera page loaded');
  },

  onCancel() {
    console.log('Camera cancelled');
    wx.navigateBack();
  },

  takePhoto() {
    console.log('Taking photo');
    
    const cameraContext = wx.createCameraContext();
    
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('Photo taken successfully:', res.tempImagePath);
        this.setData({
          imageTaken: true,
          tempImagePath: res.tempImagePath
        });
      },
      fail: (error) => {
        console.error('Failed to take photo:', error);
        wx.showToast({
          title: '拍照失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  onChooseFromAlbum() {
    console.log('Choosing from album');
    
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        console.log('Image chosen from album:', res.tempFilePaths[0]);
        this.setData({
          imageTaken: true,
          tempImagePath: res.tempFilePaths[0]
        });
      },
      fail: (error) => {
        console.error('Failed to choose image:', error);
      }
    });
  },

  onCancelPreview() {
    console.log('Preview cancelled');
    this.setData({
      imageTaken: false,
      tempImagePath: ''
    });
  },

  onConfirmPhoto() {
    console.log('Photo confirmed');
    this.uploadAndAnalyzeImage();
  },

  onCameraError(error: any) {
    console.error('Camera error:', error);
    wx.showToast({
      title: '相机初始化失败，请检查权限设置',
      icon: 'none'
    });
  },

  uploadAndAnalyzeImage() {
    console.log('Uploading and analyzing image');
    
    this.setData({
      isUploading: true
    });

    // In real implementation, this would upload to cloud storage and call AI API
    // Simulating with a timeout for now
    setTimeout(() => {
      console.log('Image analysis completed');
      
      this.setData({
        isUploading: false
      });

      // Generate a unique ID for this food record
      const recordId = `food_${Date.now()}`;
      
      // Navigate to feedback page with the record ID
      wx.navigateTo({
        url: `/pages/feedback/feedback?id=${recordId}&imageUrl=${encodeURIComponent(this.data.tempImagePath)}`
      });
    }, 2000);
  }
}); 