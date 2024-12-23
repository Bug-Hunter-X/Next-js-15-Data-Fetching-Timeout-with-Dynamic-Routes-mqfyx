// bugSolution.js
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default function MyComponent(props) {
  // ... your component code
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context, authOptions);
  const startTime = Date.now();

  try {
    //Data Fetching with timeout
    const data = await Promise.race([
      fetch('your-long-running-api-endpoint'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000) // 5-second timeout
      ),
    ]);
    const endTime = Date.now();
    const fetchDuration = endTime - startTime;
    console.log(`Data fetching took ${fetchDuration}ms`);
    return {
      props: {
        data: await data.json(),
        session
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        error: error.message,
        session
      },
    };
  }
}
