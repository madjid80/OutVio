const sinon = require('sinon')
const authenticate = require('../../src/middlewares/authenticate')

describe('authenticate middleware', () => {
  let sandbox
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should return a 401 if the auth code is missing from the headers', () => {
    const mockReq = {
      headers: {},
    }
    const mockJson = sandbox.stub()
    const mockRes = {
      status: sandbox.stub().returns({ json: mockJson }),
    }
    const mockNext = sandbox.stub()
    authenticate(mockReq, mockRes, mockNext)
    expect(mockRes.status.calledWith(401)).toBe(true)
    expect(
      mockJson.calledWith({ message: 'Auth code is missing from headers.' }),
    ).toBe(true)
  })

  it('should return a 401 if the auth code is invalid', () => {
    const mockReq = {
      headers: {
        'auth-code': 'invalid_code',
      },
    }
    const mockJson = sandbox.stub()
    const mockRes = {
      status: sandbox.stub().returns({ json: mockJson }),
    }
    const mockNext = sandbox.stub()
    authenticate(mockReq, mockRes, mockNext)
    expect(mockRes.status.calledWith(401)).toBe(true)
    expect(mockJson.calledWith({ message: 'Invalid auth code.' })).toBe(true)
  })

  it('should return a 401 if the JWT token fails to authenticate', () => {
    const mockReq = {
      headers: {
        'auth-code': 'expired_token',
      },
    }
    const mockJson = sandbox.stub()
    const mockRes = {
      status: sandbox.stub().returns({ json: mockJson }),
    }
    const mockNext = sandbox.stub()
    authenticate(mockReq, mockRes, mockNext)
    expect(mockRes.status.calledWith(401)).toBe(true)
  })

  it('should add the decoded JWT payload to the request object and call next() if the JWT token is valid', () => {
    const mockReq = {
      headers: {
        'auth-code':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiZW1haWwiOiJ1c2VyMUBleGFtcGxlLmNvbSIsInVzZXJJZCI6IjEiLCJyb2xlSWQiOiJhZG1pbiJ9.h-js_QimTojnYFiUSKCIVFaIX2OtHyCvT92eK8CM9nA',
      },
    }
    const mockJson = sandbox.stub()
    const mockRes = {
      status: sandbox.stub().returns({ json: mockJson }),
    }
    const mockNext = sandbox.stub()
    authenticate(mockReq, mockRes, mockNext)

    expect(mockReq.user.username).toBe('user1')
    expect(mockReq.user.email).toBe('user1@example.com')
    expect(mockReq.user.userId).toBe('1')
    expect(mockReq.user.roleId).toBe('admin')
    expect(mockNext.called).toBe(true)
  })
})
