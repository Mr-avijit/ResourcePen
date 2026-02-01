import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('------------------------------------------------');
  console.log(`[RESOURCES PEN] Architectural Core Active`);
  console.log(`[ENDPOINT] http://localhost:${PORT}/api/v1`);
  console.log(`[NEURAL_LINK] Active: ${!!process.env.API_KEY}`);
  console.log('------------------------------------------------');
});
