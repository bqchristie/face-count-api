// Functions exported from here will be available as background tasks; see src/utils/queue.js

export async function processImages(task, done) {
  console.log(task.data);
  done();
}
