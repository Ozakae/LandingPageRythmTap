// export function generateBeatmap(bpm, durationMs, startOffsetMs = 1000) {
//   const beatMs = 60000 / bpm
//   const notes = []
//   const patterns = [
//     [0],
//     [2],
//     [1],
//     [3],
//     [0, 2],
//     [1, 3],
//     [0],
//     [3],
//     [1],
//     [2],
//     [0, 1],
//     [2, 3],
//     [0],
//     [2],
//     [1],
//     [3],
//   ]

//   let time = startOffsetMs
//   let patIdx = 0

//   while (time < durationMs - 2000) {
//     const pattern = patterns[patIdx % patterns.length]

//     // Tiap 4 beat sekali, tambah variasi double note
//     const isDouble = patIdx % 4 === 3

//     if (isDouble && pattern.length === 1) {
//       // Tambah note kedua di lane yang berbeda
//       const extraLane = (pattern[0] + 2) % 4
//       pattern.forEach(lane => {
//         notes.push({ time: Math.round(time), lane })
//       })
//       notes.push({ time: Math.round(time), lane: extraLane })
//     } else {
//       pattern.forEach(lane => {
//         notes.push({ time: Math.round(time), lane })
//       })
//     }

//     // Tiap 8 beat sekali, skip 1 beat (bikin variasi ritme)
//     const skip = patIdx % 8 === 7 ? 2 : 1
//     time += beatMs * skip
//     patIdx++
//   }

//   return notes.sort((a, b) => a.time - b.time)
// }