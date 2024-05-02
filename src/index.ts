import axios from 'axios';

const baseURL = 'https://api.your-iriusrisk-instance.com';
const apiKey = 'your_api_key_here';

const http = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }
});

async function createComponent() {
  const componentData = {
    ref: "S3Component",
    name: "AWS S3 Bucket",
    desc: "S3 storage bucket in AWS",
    visible: true,
    category: {
      name: "AWS Services"
    },
    riskPatterns: []
  };

  try {
    const response = await http.post('/api/v1/security-content/components', componentData);
    console.log('Component Created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create component:', error);
    throw error;
  }
}

async function createLibrary() {
  const libraryData = {
    ref: "CustomAWSLib",
    name: "Custom AWS Library",
    desc: "A custom library for AWS-specific components",
    riskPatterns: [
      {
        ref: "awsS3RiskPattern",
        name: "Risk Pattern for S3",
        desc: "Handles common risks associated with S3 buckets"
      }
    ]
  };

  try {
    const response = await http.post('/api/v1/libraries', libraryData);
    console.log('Library Created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create library:', error);
    throw error;
  }
}

async function addThreatToRiskPattern(libraryId: string, riskPatternId: string) {
  const threatData = {
    name: "Threat 1",
    desc: "A primary threat example for S3",
    riskRating: {
      confidentiality: "high",
      integrity: "medium",
      availability: "high"
    }
  };

  try {
    const response = await http.post(`/api/v1/libraries/${libraryId}/riskpatterns/${riskPatternId}/threats`, threatData);
    console.log('Threat Added:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to add threat:', error);
    throw error;
  }
}

async function executePlan() {
  try {
    const component = await createComponent();
    const library = await createLibrary();
    const threat = await addThreatToRiskPattern(library.ref, library.riskPatterns[0].ref);
    console.log('Execution completed successfully.');
  } catch (error) {
    console.error('Execution failed:', error);
  }
}

executePlan();
