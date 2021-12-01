
# A cheaper lottery

A solution to perform a complex lottery by using the VRF in a call to an external adapter, as opposed to making on-chain calculations.

The current on-chain solution is ok, but could be made cheaper in terms of gas.


## IDEA: create REST API to fulfill this request.

We have an array of contribution amounts. The seed is used to pick a random element from the array, but according to a distribution that respects the amounts by **making the highest amount most likely to be picked**.

HTTP POST with the following json payload
- array of integers (weights)
- large random integer number (seed)

like:
{
  "weights": [
    2,
    5,
    40,
    20,
    1,
    100
  ],
  "seed": "30207470459964961279215818016791723193587102244018403859363363849439350753829"
}

HTTP response json: 

{
  "pickedIdx": number
}



ALGORITHM for determining pickedIdx


expand weights into an array like this

const expanded = [
  0,0,
  1,1,1,1,1,
  2,2,2,2,2 ... 2,    // 40 times
  3,3,3,3,3 ... 3,    // 20 times
  4,
  5,5,5,5,5 ... 5     // 100 times
]

pick one element from expanded

const pickedIdx = seed % expanded.length 
return pickedIdx


