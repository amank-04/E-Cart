export const CreateSuccess = (status: number, message: string, data?: any) => {
  return {
    status,
    message,
    data,
  };
};
