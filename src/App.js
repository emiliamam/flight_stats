import React from 'react';

import { CountryPicker, Chart, MapComponent, Card, PunctualityDashboard } from './components';
import { fetchData } from './api/';
import styles from './App.module.css';
import 'leaflet/dist/leaflet.css';


import image from './images/image.png';

class App extends React.Component {
  state = {
    data: [],
    country: '',
    activePage: 'Ситуационный центр', 
  }

  setActivePage = (page) => {
    this.setState({ activePage: page });
  }
  async componentDidMount() {
    try {
      const response = await fetch('/api/get_airports');
      const airports = await response.json();

      console.log(airports, 'airports')
      this.setState({ data: airports });
    } catch (error) {
      console.error('Ошибка загрузки аэропортов:', error);
    }
  }

  handleCountryChange = async (country) => {
    const response = await fetch('/airports.json');  
    const data = await response.json();

    this.setState({ data, country: country });
  }

  render() {
const { data, country, activePage } = this.state; 

    return (
      <div className={styles.container}>
        <header className={styles.header}>
        <nav className={styles.nav}>
        <span className={styles.navItem} onClick={() => this.setActivePage('Ситуационный центр')}>Ситуационный центр</span>
        <span className={styles.navItem} onClick={() => this.setActivePage('Статистика')}>Статистика</span>
        <span className={styles.navItem} onClick={() => this.setActivePage('Аналитика')}>Аналитика</span>
        <span className={styles.navItem} onClick={() => this.setActivePage('Карта')}>Карта</span>
      </nav>
      </header>    
   
      {activePage === 'Ситуационный центр' &&   <PunctualityDashboard /> }
      {activePage === 'Статистика' && <CountryPicker handleCountryChange={this.handleCountryChange} />}
      {activePage === 'Аналитика' && <Chart data={data} country={country} />}
      {activePage === 'Карта' && <MapComponent airports={data} />}
      {/* </main> */}
      <footer className={styles.footer}>
  <div className={styles.footerContent}>
    <p>&copy; {new Date().getFullYear()} Рейтинг пунктуальности</p>
    <p>Разработано студентами РУТ </p>
  </div>
</footer>
      </div>
      
    );
  }
}

export default App;