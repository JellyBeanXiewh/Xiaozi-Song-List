import assert from 'assert'
import path from 'path'
import fs from 'fs'
import ExcelJS from 'exceljs'
import cnchar from 'cnchar'

([ 'cnchar-poly', 'cnchar-trad', ]).map(id => import(id)).forEach(f => cnchar.use(f))

const getSpell = (str) => cnchar.spell(str)

const src = path.resolve('scripts/song_list.xlsx')
const dst = path.resolve('src/assets/json/song_list.json')

const loadSongList = async (src, dst) => {
  const mapTitleName = {
    '歌名': 'song',
    '歌手': 'artist',
    '语言': 'lang',
    '备注': 'remark',
  }

  const workbook = new ExcelJS.Workbook()
  workbook.calcProperties.fullCalcOnLoad = true
  await workbook.xlsx.readFile(src)

  let songList = []
  if (workbook.worksheets.length > 0) {
    const ws0 = workbook.worksheets[0]

    const findHeader = (worksheet) => {
      for (let i = 1; i <= worksheet.rowCount; ++i) {
        const row = worksheet.getRow(i)
        if (row.actualCellCount > 0) { return row }
      }
      return undefined
    }

    const makeRowGroupParser = (header) => {
      let rowParsers = {}

      if (header) {
        header.eachCell((cell, idx) => {
          const uniqueId = mapTitleName[cell.text]
          if (uniqueId) {
            rowParsers[uniqueId] = {
              src: {
                row: 1, col: idx, name: cell.text,
              }, parse(d) {
                return d.getCell(this.src.col).text || ''
              },
            }
          }
        })

        rowParsers.song && (rowParsers.song = Object.setPrototypeOf({
            parse(d) {
              const nm = super.parse(d)
              return (console.log(nm), assert(nm, 'song not found'), nm)
            },
            post: {
              initial: (v, d) => {
                let _initial = getSpell(v)[0]?.toUpperCase() ?? ''
                if (_initial < 'A' || _initial > 'Z') {
                  _initial = '#'
                }
                return _initial
              }
            }
          }, rowParsers.song))
      }

      return {
        rowParsers: rowParsers,
        parse(r) {
          let d = {}
          Object.entries(this.rowParsers).forEach(([k0, p0]) => {
            const v = p0.parse(r)
            p0.post && Object.entries(p0.post).forEach(([k1, p1,]) => {
              d[k1] = p1(v, r)
            })
            d[k0] = v
          })
          return d
        },
      }
    }

    const rowFilter = (group, r, idx) => {
      // Skip empty rows
      if(r.actualCellCount <= 0) { return false }
      if (group.rowParsers.song) {
        const songNameParser = group.rowParsers.song
        const song = r.getCell(songNameParser.src.col).text
        // Skip empty name rows
        if (!song) { return false }
        // Skip the head row of the table
        else if (song === songNameParser.src.name) { return false }
      }

      return true
    }

    const rowGroupParser = makeRowGroupParser(findHeader(ws0))
    ws0.eachRow((r, i) => {
      if (!rowFilter(rowGroupParser, r, i)) { return }
      const songData = rowGroupParser.parse(r)
      songList.push(songData)
    })
  }

  fs.writeFileSync(dst, JSON.stringify(songList))
  console.log('生成歌单完成')
}

loadSongList(src, dst)
