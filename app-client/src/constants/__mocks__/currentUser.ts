/*
 * Copyright (c) 2011-Present, Precise.ly, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are not permitted.
 */
function mockCurrentUser() {
  return {
    isAuthenticated: jest.fn(),
    __mockisAuthenticatedSuccessCase() {
      currentUser.isAuthenticated.mockReturnValue(true);
    },
    __mockisAuthenticatedFailureCase() {
      currentUser.isAuthenticated.mockReturnValue(false);
    },

    logout: jest.fn(),
    __mockLogoutSuccessCase() {
      currentUser.logout.mockReturnValueOnce(true);
    },
    __mockLogoutFailureCase() {
      currentUser.logout.mockReturnValueOnce(false);
    },
    __resetCurrentUserMocks: () => (currentUser = mockCurrentUser())
  };
}

export let currentUser = mockCurrentUser();
