import { strict } from 'assert'
import path from 'path'
import fs from 'fs'
import ExcelJS from 'exceljs'

interface SongItem {
  song: string;
  artist: string;
  lang: string;
  remark: string;

  [key: string]: string; // 允许其他可能的字符串属性
}

interface Parser {
  src: {
    row: number;
    col: number;
    name: string;
  };
  parse: (row: ExcelJS.Row) => string;
}

interface GroupParser {
  rowParsers: Record<string, Parser>;
  parse: (row: ExcelJS.Row) => SongItem;
}

const src = path.resolve('scripts/song_list.xlsx')
const dst = path.resolve('src/assets/json/song_list.json')

const loadSongList = async (src: string, dst: string): Promise<void> => {
  const mapTitleName: Record<string, keyof SongItem> = {
    '歌名': 'song',
    '歌手': 'artist',
    '语言': 'lang',
    '备注': 'remark',
  }

  const workbook = new ExcelJS.Workbook()
  workbook.calcProperties.fullCalcOnLoad = true
  await workbook.xlsx.readFile(src)

  const songList: SongItem[] = []

  if (workbook.worksheets.length > 0) {
    const ws0 = workbook.worksheets[0]

    const findHeader = (worksheet: ExcelJS.Worksheet): ExcelJS.Row | undefined => {
      for (let i = 1; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i)
        if (row.actualCellCount > 0) return row
      }
      return undefined
    }

    const makeRowGroupParser = (header?: ExcelJS.Row): GroupParser => {
      const rowParsers: Record<string, Parser> = {}

      if (header) {
        header.eachCell((cell, idx) => {
          const uniqueId = mapTitleName[cell.text]
          if (uniqueId) {
            rowParsers[uniqueId] = {
              src: {
                row: 1,
                col: idx,
                name: cell.text,
              },
              parse: (row: ExcelJS.Row) => row.getCell(idx).text?.toString() ?? '',
            }
          }
        })

        if (rowParsers.song) {
          const baseParser = rowParsers.song
          rowParsers.song = {
            ...baseParser,
            parse: (row: ExcelJS.Row) => {
              const nm = baseParser.parse(row)
              console.log(nm)
              strict(nm, 'song not found')
              return nm
            },
          }
        }
      }

      return {
        rowParsers,
        parse: (row: ExcelJS.Row) => {
          const data: SongItem = {} as SongItem
          Object.entries(rowParsers).forEach(([key, parser]) => {
            data[key as keyof SongItem] = parser.parse(row)
          })
          return data
        },
      }
    }

    const rowFilter = (groupParser: GroupParser, row: ExcelJS.Row, idx: number): boolean => {
      // 跳过空行
      if (row.actualCellCount <= 0) return false
      if (groupParser.rowParsers.song) {
        const songNameParser = groupParser.rowParsers.song
        const song = row.getCell(songNameParser.src.col).text?.toString()
        // 跳过空歌名行和表头行
        if (!song || song === songNameParser.src.name) return false
      }
      return true
    }

    const rowGroupParser = makeRowGroupParser(findHeader(ws0))
    ws0.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      if (!rowFilter(rowGroupParser, row, rowNumber)) return
      const songItem = rowGroupParser.parse(row)
      songList.push(songItem)
    })
  }

  fs.writeFileSync(dst, JSON.stringify(songList))
  console.log('生成歌单完成')
}

loadSongList(src, dst).catch(console.error)
