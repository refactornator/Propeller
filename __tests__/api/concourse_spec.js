require('whatwg-fetch');

jest.unmock('../../api/concourse');

import Concourse from '../../api/concourse';

describe('Concourse', () => {
  let concourse, fetchSpy;
  beforeEach(() => {
    let promise = Promise.resolve(new Response('{}', {
      headers: 'Content-Type: application/json',
      status: 200}));
    fetchSpy = jasmine.createSpy('fetch').and.returnValue(promise);

    concourse = new Concourse(fetchSpy, 'http://my-host.com', 'my-token');
  });

  it('fetches pipelines', () => {
    concourse.fetchPipelines();

    expect(fetchSpy).toBeCalledWith('http://my-host.com/api/v1/pipelines', {
      headers: {
        Cookie: 'ATC-Authorization=Basic my-token'
      }
    });
  });
});
