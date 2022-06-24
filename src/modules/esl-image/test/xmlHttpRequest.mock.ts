interface mockXMLHttpRequestController {
  open: jest.Mock;
  onreadystatechange: jest.Mock;
  cleanUp: () => void;
  setData: (newData: string, newStatus?: number, newReadyState?: number) => void;
  send: jest.Mock;
}

interface mockedXMLHttpRequest {
  open: jest.Mock;
  onreadystatechange: jest.Mock;
  send: jest.Mock;
  readyState: number;
  status: number;
  responseText: string;
}

export function mockXMLHttpRequest(): mockXMLHttpRequestController  {
  // mocked properties
  let readyState = 4;
  let status = 200;
  let responseText: string = 'responseText from mocked XMLHttpRequest';

  // mocked functions
  const open = jest.fn();
  const onreadystatechange = jest.fn();
  const send = jest.fn(function send() {
    this.onreadystatechange();
  });

  // set data to return on next request
  function setData(newData: string, newStatus: number = 200, newReadyState: number = 4): void {
    responseText = newData;
    status = newStatus;
    readyState = newReadyState;
  }

  // clean up mocked implementation
  function cleanUp(): void {
    if (window.XMLHttpRequest) {
      // @ts-ignore
      delete window.XMLHttpRequest;
    }
  }

  // mock constructor that will replace window XMLHttpRequest
  function mockConstructor(): mockedXMLHttpRequest {
    return {
      readyState,
      status,
      responseText,
      open,
      onreadystatechange,
      send
    };
  }

  // override/define XMLHttpRequest
  // @ts-ignore
  window.XMLHttpRequest = mockConstructor;

  // returning necessary methods for further testing and functionality
  return {
    open,
    onreadystatechange,
    cleanUp,
    setData,
    send
  };
}
