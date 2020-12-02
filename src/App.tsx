import { useState } from "react"
import classNames from "classnames/bind"
import { update } from "ramda"
import styles from "./App.module.scss"
import shuffle from "./shuffle"

const cx = classNames.bind(styles)

const App = () => {
  const { data, setName, shuffleGroup } = useData()

  return (
    <article className={styles.app}>
      <h1>32명으로 팀 구성하기</h1>

      <section className={styles.main}>
        {data.map((group, groupIndex) => (
          <div key={groupIndex}>
            <ul className={cx(styles.group, { team: !groupIndex })}>
              {group.map((name, nameIndex) => (
                <li key={nameIndex}>
                  <input
                    className={styles.input}
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value, groupIndex, nameIndex)
                    }
                  />
                </li>
              ))}
            </ul>

            <button
              className={styles.button}
              onClick={() => shuffleGroup(groupIndex)}
            >
              이 그룹 섞기
            </button>
          </div>
        ))}
      </section>

      <aside className={styles.random}>
        <button
          className={styles.button}
          onClick={() => alert(data[0][Math.ceil(Math.random() * 8)])}
        >
          깍두기
        </button>
      </aside>
    </article>
  )
}

export default App

/* hooks */ type Data = string[][]
const useData = () => {
  const KEY = "data"
  const local = localStorage.getItem(KEY)
  const empty = Array.from({ length: 5 }, () =>
    Array.from({ length: 8 }, () => "")
  )

  const init = () => (local ? JSON.parse(local) : empty)
  const [data, setData] = useState<Data>(init)

  const updateData = (data: Data) => {
    localStorage.setItem(KEY, JSON.stringify(data))
    setData(data)
  }

  const setName = (name: string, groupIndex: number, nameIndex: number) => {
    const next = update(
      groupIndex,
      update(nameIndex, name, data[groupIndex]),
      data
    )

    updateData(next)
  }

  const shuffleGroup = (groupIndex: number) => {
    const next = update(groupIndex, shuffle(data[groupIndex]), data)
    updateData(next)
  }

  return { data, setName, shuffleGroup }
}
