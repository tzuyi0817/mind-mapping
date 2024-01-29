export const DEFAULT_MAPPING = {
  root: {
    data: {
      text: 'root node',
    },
    children: [
      {
        data: {
          text: 'secondary node',
          generalization: {
            text: 'generalization',
          },
        },
        children: [
          {
            data: {
              text: 'branch topic',
            },
            children: [],
          },
          {
            data: {
              text: 'branch topic',
            },
            children: [],
          },
        ],
      },
    ],
  },
};
