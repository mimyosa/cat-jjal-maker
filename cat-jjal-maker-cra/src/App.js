//import logo from './logo.svg';
import React from "react"
import './App.css';
import Title from "./components/Title"

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};


const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleInputChange(e) {
    const userValue = e.target.value;
    setValue(userValue.toUpperCase());
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    }
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    if (value === '') {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return
    }
    updateMainCat(value);
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" name="name" placeholder="영어 대사를 입력해주세요" onChange={handleInputChange} value={value} />
      <button type="submit">생성2</button>
      <p style={{ color: 'red' }}>{errorMessage}</p>
    </form>
  );
};

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: '150px' }} alt="cat" />
    </li>
  );
}

//const CAT1 = "http://jjal.dhappy.net/Images/upload/2018/0/5/41f5bb5b-d4a4-46aa-afb3-5ed7118cedba";
const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
//const CAT2 = "http://jjal.dhappy.net/Images/upload/2018/1/1/f4fc35a6-2f09-45ad-9e6f-6f92fbfbde8a";
//const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
//const CAT3 = "http://jjal.dhappy.net/Images/upload/2018/0/11/208a7ab2-f3cf-4aa1-9ba2-fde56546835e";
//const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>
  }
  return (
    <ul className="favorites">
      {favorites.map(cat => <CatItem img={cat} key={cat} />)}
    </ul>
  );
};

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick} >{heartIcon}</button>
    </div>
  )

}

function Card(title, description) {
  return <div><h2>{title}</h2>{description}</div>;
}

<Card title="리액트 짱" description="리액트 입니다" />

const App = () => {
  //const [counter, setCounter] = React.useState(jsonLocalStorage.getItem('counter'));
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [mainCat, setMainCat] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });
  //const [favorites, setFavorites] = React.useState(jsonLocalStorage.getItem("favorites") || []);

  const alreadyFavorite = favorites.includes(mainCat);

  const counterTitle = counter === null ? "" : counter + "번째 ";

  async function setInitialCat() {
    const newCat = await fetchCat('First Cat');
    setMainCat(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return prev + 1
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }

  return (
    <div id="app">
      <Title>{counterTitle}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>

  );
};

export default App;
