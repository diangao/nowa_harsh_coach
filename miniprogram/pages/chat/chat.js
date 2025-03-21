// chat.js - JavaScript implementation to make the simulator work
// Define utility functions
const formatTime = (date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${formatNumber(hour)}:${formatNumber(minute)}`;
};

const formatNumber = (n) => {
  const s = n.toString();
  return s[1] ? s : '0' + s;
};

Page({
  data: {
    messages: [],
    inputText: '',
    isTyping: false,
    showCamera: false,
    showPreview: false,
    isUploading: false,
    tempImagePath: '',
    scrollToView: '',
  },

  onLoad() {
    console.log('Chat page loaded');
    // Add initial message from AI coach
    this.addAIMessage('你好，我是你的毒舌减肥教练！拍照上传你的食物，我会告诉你该不该吃！');
  },

  // Text input handlers
  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  sendTextMessage() {
    const { inputText } = this.data;
    if (!inputText.trim()) return;

    // Add user message
    this.addUserMessage(inputText, 'text');
    
    // Clear input
    this.setData({
      inputText: ''
    });

    // Simulate AI typing
    this.simulateAITyping();
    
    // Add a generic response
    setTimeout(() => {
      this.addAIMessage('我是你的减肥教练，不是闲聊机器人。拍张食物照片给我看看吧！', []);
    }, 1500);
  },

  // Camera handlers
  onOpenCamera() {
    console.log('Opening camera');
    this.setData({
      showCamera: true
    });
  },

  onCloseCamera() {
    console.log('Closing camera');
    this.setData({
      showCamera: false
    });
  },

  onCameraOverlayClick() {
    this.onCloseCamera();
  },

  stopPropagation() {
    // Do nothing, just prevent event propagation
  },

  takePhoto() {
    console.log('Taking photo');
    const cameraContext = wx.createCameraContext();
    
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('Photo taken:', res.tempImagePath);
        this.setData({
          tempImagePath: res.tempImagePath,
          showCamera: false,
          showPreview: true
        });
      },
      fail: (error) => {
        console.error('Failed to take photo:', error);
        wx.showToast({
          title: '拍照失败',
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
        console.log('Image selected:', res.tempFilePaths[0]);
        this.setData({
          tempImagePath: res.tempFilePaths[0],
          showCamera: false,
          showPreview: true
        });
      },
      fail: (error) => {
        console.error('Failed to choose image:', error);
      }
    });
  },

  onCameraError(e) {
    console.error('Camera error:', e.detail);
    wx.showToast({
      title: '相机启动失败',
      icon: 'none'
    });
  },

  // Preview handlers
  onPreviewOverlayClick() {
    this.onCancelPreview();
  },

  onCancelPreview() {
    console.log('Canceling preview');
    this.setData({
      showPreview: false,
      tempImagePath: ''
    });
  },

  onConfirmPhoto() {
    console.log('Confirming photo');
    const { tempImagePath } = this.data;
    
    // Add user image message
    this.addUserMessage(tempImagePath, 'image');
    
    // Show loading
    this.setData({
      showPreview: false,
      isUploading: true
    });

    // Simulate AI processing
    this.simulateImageProcessing(tempImagePath);
  },

  // Message handling
  addUserMessage(content, type) {
    const messages = this.data.messages;
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      type,
      content: type === 'text' ? content : '',
      imageUrl: type === 'image' ? content : undefined,
      time: formatTime(new Date())
    };
    
    messages.push(newMessage);
    
    this.setData({
      messages,
      scrollToView: `msg-${newMessage.id}`
    });
    
    console.log(`Added user ${type} message:`, newMessage);
  },

  addAIMessage(content, responseOptions = []) {
    const messages = this.data.messages;
    const newMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      type: 'text',
      content,
      time: formatTime(new Date()),
      responseOptions
    };
    
    messages.push(newMessage);
    
    this.setData({
      messages,
      isTyping: false,
      scrollToView: `msg-${newMessage.id}`
    });
    
    console.log('Added AI message:', newMessage);
  },

  simulateAITyping() {
    this.setData({
      isTyping: true
    });
  },

  // Response options handling
  onSelectResponse(e) {
    const { optionId, optionText } = e.currentTarget.dataset;
    console.log('User selected response:', optionText, 'with ID:', optionId);
    
    // Add the selected response as a user message
    this.addUserMessage(optionText, 'text');
    
    // Simulate AI typing
    this.simulateAITyping();
    
    // Simulate AI response based on option ID
    setTimeout(() => {
      let aiResponse = '';
      let nextOptions = [];
      
      switch (optionId) {
        case 'curious':
          aiResponse = '你觉得呢？你是来瘦的，不是来挑战物理定律的。';
          nextOptions = [{
            id: 'solution',
            text: '有没有补救方案？'
          }];
          break;
        
        case 'defiant':
          aiResponse = '随你，但等你后悔的时候别来找我。胖起来可比瘦下来容易多了。';
          break;
        
        case 'helpful':
          aiResponse = '好吧，吃一半，然后今晚多走5000步。这总比完全放弃要好。';
          nextOptions = [{
            id: 'accept',
            text: '接受建议'
          }, {
            id: 'reject',
            text: '太难了'
          }];
          break;
          
        case 'solution':
          aiResponse = '每天多走30分钟，少吃一半主食，一周内可以扭转这次的"罪行"。';
          nextOptions = [{
            id: 'accept',
            text: '好的，我会试试'
          }];
          break;
        
        case 'accept':
          aiResponse = '不错，有进步。坚持下去，下次拍照给我看看你的进步。';
          break;
          
        case 'reject':
          aiResponse = '这都嫌难？算了，随你去吧，反正又不是我变胖。';
          break;
          
        default:
          aiResponse = '好吧，我明白了。下次拍照给我看看你的进步！';
      }
      
      this.addAIMessage(aiResponse, nextOptions);
    }, 1500);
  },

  // Image processing (simulated for now)
  simulateImageProcessing(imagePath) {
    console.log('Processing image:', imagePath);
    
    // In a real app, you'd upload the image to a server for processing
    // Here we simulate it with a timeout and mock data
    setTimeout(() => {
      // Mock food analysis result
      const isFastFood = Math.random() > 0.5;
      
      const mockFeedback = {
        isHealthy: !isFastFood,
        sarcasticOpening: isFastFood 
          ? '哇，又是垃圾食品？你是认真的吗？' 
          : '看起来你终于懂得吃点健康的了！',
        sarcasticComment: isFastFood 
          ? '这种高油高盐的食物只会让你的减肥计划彻底泡汤。' 
          : '继续保持，至少这次没让我太失望。',
        advice: isFastFood 
          ? ['只吃一半', '多喝水冲淡油腻感', '今晚多走5000步'] 
          : ['适量食用', '可以搭配一些蔬菜', '少放调料'],
        responseOptions: {
          curious: '没事吧？',
          defiant: '我就想吃！',
          helpful: '有没有补救方案？'
        },
        responseReplies: {
          curious: '你觉得呢？你是来瘦的，不是来挑战物理定律的。',
          defiant: '随你，但等你后悔的时候别来找我。',
          helpful: '好吧，吃一半，然后今晚多走5000步。'
        }
      };
      
      // Create mock food item
      const mockFoodItem = {
        name: isFastFood ? '快餐' : '健康食品',
        confidence: 0.9,
        category: isFastFood ? 'fried' : 'vegetables',
        healthScore: isFastFood ? 3 : 8
      };
      
      // Create mock recognition result
      const mockRecognition = {
        items: [mockFoodItem],
        timestamp: Date.now()
      };
      
      // Create mock food record
      const mockRecord = {
        id: Date.now().toString(),
        imageUrl: imagePath,
        timestamp: Date.now(),
        feedback: mockFeedback,
        recognitionResult: mockRecognition,
        userHealthOpinion: isFastFood ? 'unhealthy' : 'healthy',
        ignored: false
      };
      
      console.log('Generated mock food record:', mockRecord);
      
      // Hide loading
      this.setData({
        isUploading: false
      });
      
      // Add AI response with the sarcastic opening
      this.simulateAITyping();
      setTimeout(() => {
        this.addAIMessage(mockFeedback.sarcasticOpening);
        
        // After a short delay, add the detailed feedback with response options
        setTimeout(() => {
          this.simulateAITyping();
          setTimeout(() => {
            this.addAIMessage(mockFeedback.sarcasticComment, [
              { id: 'curious', text: mockFeedback.responseOptions.curious },
              { id: 'defiant', text: mockFeedback.responseOptions.defiant },
              { id: 'helpful', text: mockFeedback.responseOptions.helpful }
            ]);
          }, 1000);
        }, 1500);
      }, 1000);
      
      // Save the record (in a real app, you'd save to the server/local storage)
      console.log('Would save food record:', mockRecord);
    }, 3000);
  },

  // Image preview
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
      current: url
    });
  },

  // Message loading
  loadMoreMessages() {
    console.log('Loading more messages...');
    // In a real app, you'd load older messages here
  }
}); 