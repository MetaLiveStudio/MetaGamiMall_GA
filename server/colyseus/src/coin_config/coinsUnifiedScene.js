export const coinsUnifiedScene = [
[4 , 2.4 , 4],
[4 , 2.4 , 7],
[4 , 2.4 , 9],
[4 , 2.4 , 12],
[7 , 2.4 , 4],
[7 , 2.4 , 12],
[9 , 2.4 , 4],
[9 , 2.4 , 12],
[12 , 2.4 , 4],
[12 , 2.4 , 7],
[12 , 2.4 , 9],
[12 , 2.4 , 12]
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



