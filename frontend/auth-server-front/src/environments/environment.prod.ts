export const environment = {
  production: true,
  shouldMockResp: false,
  isThroughGateway: true,
  mockData: {
    authToken: "123123123123123",
    userInfo: {
      id: 1,
      username: "Test User",
      role: "admin",
      isDisabled: 0,
      reviewStatus: "APPROVED",
      createTime: "2022-01-01 12:00",
      updateTime: "",
      updateBy: "",
      createBy: "",
      registerDate: "2022-01-01 12:00",
    },
    userKeyList: {
      pagingVo: {
        page: 1,
        limit: 10,
        total: 100,
      },
      payload: [
        {
          id: 1,
          secretKey: "BC12392381LKDSF123",
          name: "work",
          expirationTime: "2022-07-07",
          createTime: "2022-06-07",
        },
        {
          id: 2,
          secretKey: "BC12392381LKDSF123",
          name: "home",
          expirationTime: "2022-07-07",
          createTime: "2022-06-07",
        },
      ],
    },
  },
};
