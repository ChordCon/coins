import { Route, Routes, useLocation, useParams, useMatch } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinInfo, fetchCoinPrice } from "../api";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 48px;
  font-weight: 1000;
`;

const Loading = styled.h2`
  text-align: center;
  font-size: 30px;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 5px;
  line-height: 25px;
`;
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
    transition: 1s;
  }
  &:hover {
    color: ${(props) => props.theme.accentColor};
  }
`;
// infoData interface
interface Stats {
  subscribers: number;
  contributors?: number;
  stars?: number;
  followers?: number;
}
interface Links {
  explorer: string[];
  facebook: string[];
  reddit: string[];
  source_code: string[];
  website: string[];
  youtube: string[];
}
interface LinksExtended {
  url: string;
  type: string;
  stats: Stats;
}
interface IInfo {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: Date;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  links: Links;
  links_extended: LinksExtended[];
  first_data_at: Date;
  last_data_at: Date;
}
// infoData interface

// priceData interface
interface USD {
  priceData: number;
  volume_24h: number;
  volume_24h_change_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  percent_change_15m: number;
  percent_change_30m: number;
  percent_change_1h: number;
  percent_change_6h: number;
  percent_change_12h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_1y: number;
  ath_price?: any;
  ath_date?: any;
  percent_from_price_ath?: any;
}
interface Quotes {
  USD: USD;
}
interface IPrice {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: Date;
  last_updated: Date;
  quotes: Quotes;
}
// priceData interface

function Coin() {
  const { coinId } = useParams<{ coinId: string }>();
  const { state: coinName } = useLocation();
  const priceMatch = useMatch(`/${coinId}/priceData`);
  const chartMatch = useMatch(`/${coinId}/chart`);

  const { isLoading: infoLoding, data: infoData } = useQuery<IInfo>(
    ["infoData", coinId],
    () => fetchCoinInfo(`${coinId}`)
  );
  const { isLoading: priceLoding, data: priceData } = useQuery<IPrice>(
    ["priceData", coinId],
    () => fetchCoinPrice(`${coinId}`)
  );
  const loading = infoLoding || priceLoding;

  return (
    <Container>
      <Header>
        <Title>
          {coinName ? coinName : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Open Source:</span>
              <span>{infoData?.open_source ? "Yes" : "No"}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{priceData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{priceData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/priceData`}>Price</Link>
            </Tab>
          </Tabs>
          <Routes>
            <Route path="chart" element={<Chart />} />
            <Route path="priceData" element={<Price />} />
          </Routes>
        </>
      )}
    </Container>
  );
}
export default Coin;
