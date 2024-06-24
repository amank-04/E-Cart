export const CreateError = (status: number, message: string) => {
  return {
    status,
    message,
  };
};
