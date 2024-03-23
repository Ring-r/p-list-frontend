import { useState } from 'react';
import './App.css';

function App() {

  class Purchase {
    public name: string = ""
    public count: number = 0
    public isActive: boolean = false
    public inProcess: boolean = false

    constructor(name: string) {
      this.name = name
    }
  }

  const data: { [key: string]: Purchase } = loadData()

  const [something, setSomething] = useState<number>(0)
  
  function loadData() {
    const storedData: string | null = localStorage.getItem('data')  // TODO: syncronize somehow by using api
    if (!storedData) {
      return {}
    }
    // TODO: verificate data typing before return
    return JSON.parse(storedData)
  }

  const addPurchase = (purchase: Purchase) => {
    purchase.isActive = true
  }

  const delPurchase = (purchase: Purchase) => {
    if (purchase.inProcess) {
      purchase.count++
      purchase.inProcess = false
    }
    purchase.isActive = false
  }

  const setPurchaseState = (purchase: Purchase, value: boolean) => {
    purchase.inProcess = value
  }

  const apply = () => {
    localStorage.setItem('data', JSON.stringify(data))  // save data  // TODO: syncronize somehow by using api
    setSomething((something + 1) % 2)  // run rendering
  }

  const [purchaseName, setPurchaseName] = useState<string>("")

  const add = () => {
    if (purchaseName === "") {
      return
    }

    const purchase = data[purchaseName] || (data[purchaseName] = new Purchase(purchaseName))
    addPurchase(purchase)
  }

  const filteredPurchase = Object.values(data).filter(purchase => purchase.name.startsWith(purchaseName))

  const currPurchaseItems = filteredPurchase
    .filter(purchase => purchase.isActive)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((purchase) => (
      <div className="item" key={purchase.name}>
        <label><input type="checkbox" onChange={(e) => {setPurchaseState(purchase, e.target.checked); apply()}} />{purchase.name}</label>
        <button onClick={() => {delPurchase(purchase); apply()}}>del</button>
      </div>
    ))

  const prevPurchaseItems = filteredPurchase
    .filter(purchase => !purchase.isActive)
    .sort((a, b) => b.count - a.count)
    .map((purchase) => (
      <div className="item" key={purchase.name}>
        <label>{purchase.name}</label>
        <button onClick={() => {addPurchase(purchase); apply()}}>add</button>
      </div>
    ))

  return (
    <>
      <div>
          <div className="item title"><label>curr purchases</label></div>
          <div className="list">
            {currPurchaseItems}
          </div>
      </div>
      <div>
          <div className="item title"><label>prev purchases</label></div>
          <div className="list">
            {prevPurchaseItems}
          </div>
      </div>
      <div id="input">
        <input
          type="text"
          name="purchase"
          value={purchaseName}
          placeholder="filter or create a new purchase"
          onChange={(e) => {
            setPurchaseName(e.target.value);
          }}
        />
        <button onClick={() => {add(); apply()}}>add</button>
      </div>

    </>
  )
}

export default App
