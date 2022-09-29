import { ResponseMessage } from '../types/ResponseMessage';
import config from '../config.json';

export const getHelloWorld = async () => {
  const url = `${config.backendAddress}/api/helloworld`;
  try {
    const response = await fetch(url);
    const responseData: ResponseMessage = await response.json();
    return await responseData.message;
  } catch (err) {
    console.log(err);
    return 'Error in fetching the API';
  }
};
