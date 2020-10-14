export default {
  define: {
    UAA: {
      clientId: 'witpark-rst',
      uri: 'http://192.168.24.232:10000/uaa/',
      callback: 'http://localhost:8000',
    },
  },
};
