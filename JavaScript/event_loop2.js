console.log('golb1');

setTimeout(function() {
    console.log('timeout1');
    // process.nextTick(function() {
    //     console.log('timeout1_nextTick');
    // })
    new Promise(function(resolve) {
        console.log('timeout1_promise');
        resolve();
    }).then(function() {
        console.log('timeout1_then')
    })

    setTimeout(function() {
      console.log('timeout3');
      // process.nextTick(function() {
      //   console.log('timeout2_nextTick');
      // })
      new Promise(function(resolve) {
          console.log('timeout3_promise');
          resolve();
      }).then(function() {
          console.log('timeout3_then')
      })
    })
})

setTimeout(function() {
  console.log('timeout2');
  // process.nextTick(function() {
  //   console.log('timeout2_nextTick');
  // })
  new Promise(function(resolve) {
      console.log('timeout2_promise');
      resolve();
  }).then(function() {
      console.log('timeout2_then')
  })
})