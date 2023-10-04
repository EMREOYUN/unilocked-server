export const profileValidation: any = {
  avatar: {
    optional: true,
    isString: true,
  },
  brief: {
    optional: true,
    isString: true,
  },
  num: {
    isMongoId: true,
    toInt: true,
  },
};
