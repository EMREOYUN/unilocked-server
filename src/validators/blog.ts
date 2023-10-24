export const blogSchema : any = {
  title: {
    isString: true,
    errorMessage: "Title must be a string",
    trim: true,
    escape: true,
    isLength: {
      errorMessage: "Title must be between 4 and 255 characters",
      options: { min: 4, max: 255 },
    },
  },
  body: {
    isString: true,
    errorMessage: "Body must be a string",
    trim: true,
    escape: true,
    isLength: {
      errorMessage: "Body must be between 4 and 255 characters",
      options: { min: 4, max: 255 },
    },
  },
  slug: {
    isString: true,
    errorMessage: "Slug must be a string",
    trim: true,
    escape: true,
  },
};
