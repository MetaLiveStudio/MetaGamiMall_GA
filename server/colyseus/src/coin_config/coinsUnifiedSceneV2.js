export const coinsUnifiedSceneV2 = [
[4 , 1.4 , -4],
[4 , 1.4 , -7],
[4 , 1.4 , 9],
[4 , 1.4 , 12],
[7 , 1.4 , 4],
[7 , 1.4 , 12],
[9 , 1.4 , 4],
[9 , 1.4 , 12],
[12 , 1.4 , 4],
[12 , 1.4 , 12],
[12 , 1.4 , 18],
[12 , 1.4 , 22],
[6 , 1.4 , 20,],
[12 , 1.4 , -5,],
[12 , 1.4 , -5,],
[4.8 , 1.4 , -1,],
]

function addCoinsAlongLineAxis(array,moveIdx,startPos,endPos,amountToAdd){
	const leftRailZStart = startPos[moveIdx]
	let leftRailZPos=leftRailZStart

	const leftRailZSpan = (endPos[moveIdx] - leftRailZStart)/(amountToAdd-1)
	
	for(let x=0;x<amountToAdd;x++){
	    //left far rail
        const arr = [ endPos[0] , endPos[1]  ,  endPos[2] ]
        arr[moveIdx] = leftRailZPos
	    array.push(arr)
	    leftRailZPos+=(leftRailZSpan)
	}
}



