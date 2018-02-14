const url='http://localhost:80';

const send_GET = state => {
  console.log('Sending get: ' + state.toString());
  fetch(url)
  .then(function() {
    console.log('success');
  })
  .catch(function(error) {
    console.log('failure: ' + error);
  });
  return 0;
};

const send_POST = state => {
  console.log('Sending post: ' + state.toString());
  fetch(url, {
    method: 'POST',
    body: state.toString()
  })
  .then(function() {
    console.log('success');
  })
  .catch(function(error) {
    console.log('failure: ' + error);
  });
  return 0;
};


export {send_GET, send_POST};
