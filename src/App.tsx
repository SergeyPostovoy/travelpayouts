import React, {useEffect, useState} from 'react';
import './index.css';
import {Data} from './Mock';
import accounting from 'accounting';
import copy from 'copy-to-clipboard';
import {Cirecle, CopyIcon} from "./Svg";

const pageTitle = 'Сервисы';

const App = () =>
    <div className="App">
        <ServicesPage/>
        <SideBar/>
    </div>;

const SideBar = () => {
    const pageItems = ['page1', 'page2', 'page3', 'page4', 'page5', 'page7', 'payouts', 'page5'];
    return <div className="App-sidebar"><a href="#" className="Logo">t</a>
        {pageItems.map(item => <a href="#" className={item === 'payouts' ? 'active' : ''}><Cirecle/></a>)}
    </div>;
};

const ServicesPage = () => <div className="App-services">
    <Header/>
    <div className="content">
        <h1>{pageTitle}</h1>
        <PayoutList/>
    </div>
</div>;

const Header = () => <div className="header">
    <div className="param">
        <span className="label">Баланс</span>
        <span className="value">{accounting.formatNumber(Data.header.balance, 0, " ", " ")}&nbsp;₽</span>
    </div>
    <div className="param">
        <span className="label">К выплате</span>
        <span className="value">{accounting.formatNumber(Data.header.next_payout, 0, " ", " ")}&nbsp;₽</span>
    </div>
</div>;

type FilterProps = {
    filterQuery: string;
    updateHandler: (value: string) => void
}

const Filter = ({filterQuery, updateHandler}: FilterProps) => <div className="filter">
    <div className="label">Фильтр</div>
    <input value={filterQuery} onChange={e => {
        updateHandler(e.target.value);
    }}/>
    <button onClick={() => updateHandler('')}>Сбросить</button>
</div>;

const applyFilter = (items: PayoutData[], filterQuery: string) => items.filter(item => item.title.toLowerCase().indexOf(filterQuery.toLowerCase()) !== -1)

const PayoutList = () => {
    const [filterQuery, setFilterQuery] = useState<string>('');
    const [bonuses, setBonuses] = useState<PayoutData[]>(Data.bonuses);
    const updateHandler = (value: string) => setFilterQuery(value);

    useEffect(() => {
        setBonuses(applyFilter(Data.bonuses, filterQuery));
    }, [filterQuery]);

    return <><Filter filterQuery={filterQuery} updateHandler={updateHandler}/>
        <div className="payouts">
            {
                bonuses.map((item) => {

                    return <PayoutItem item={item}/>;
                })
            }
        </div>
    </>;
};

type PayoutData = { [key: string]: any };
const PayoutItem = ({item}: PayoutData) => {

    const [isCopied, setCopied] = useState(false);
    const clickHandler = (e: React.MouseEvent<HTMLInputElement>) => {
        setCopied(item.promocode && copy(item.promocode));
        setTimeout(() => setCopied(false), 800);
    };

    return <div className="item">
        <div>
            <h2>{item.title}</h2>
            <span className="label">{item.description}</span>
        </div>
        <div className={'promocode' + (isCopied ? ' copied' : '')}><input value={item.promocode}
                                                                          onClick={clickHandler}/><CopyIcon/></div>
        <div><a href={item.link} target="_blank" className="button">Получить бонус</a>
        </div>
    </div>;
};

export default App;