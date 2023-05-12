import React from 'react';
import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButtom,
    MonthSelectIcon,
    Month
} from './styles';

import { HistoryCard } from '../../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { categories } from '../../utils/categories';
import { VictoryPie } from "victory-native";
import { RFValue } from 'react-native-responsive-fontsize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { pt } from 'date-fns/locale';



interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string
}

export function Resume() {
    const [totalbyCategories, setTotalByCategories] = useState<CategoryData[]>([])
    const [selectdDate, setSelectedDate] = useState(new Date())

    function handleDateChange(action: 'next' | 'prev') {
        if (action === 'next') {
            setSelectedDate(addMonths(selectdDate, 1));
        } else {
            setSelectedDate(subMonths(selectdDate, 1));
        }
    }


    async function loadData() {
        const dataKey = '@gofinance:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response && response.length ? JSON.parse(response) : []

        const expensives = responseFormatted
            .filter((expensive: TransactionData) => 
            expensive.type === 'negative' && 
            new Date(expensive.date).getMonth() === selectdDate.getMonth() && 
            new Date(expensive.date).getFullYear() === selectdDate.getFullYear()

            );

        const expensiveTotal = expensives.reduce((acumullator: number, expensive: TransactionData) => {
            return acumullator + Number(expensive.amount)
        }, 0)

        const totalByCategory: CategoryData[] = []

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount)
                }
            });

            if (categorySum > 0) {
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const percent = (categorySum / expensiveTotal * 100).toFixed(0) + '%'

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                })
            }
        })

        setTotalByCategories(totalByCategory)

    }

    useEffect(() => {
        loadData()
    }, [selectdDate])

    return (


        <Container>
            <Header>
                <Title>
                    Resumo por categoria
                </Title>
            </Header>

            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight(),
                }}
            >


                <MonthSelect>
                    <MonthSelectButtom onPress={() => handleDateChange('prev')}>
                        <MonthSelectIcon name="chevron-left" />
                    </MonthSelectButtom>

                    <Month>
                        {format(selectdDate, 'MMMM, yyyy ', {locale: pt} )}
                    </Month>

                    <MonthSelectButtom onPress={() => handleDateChange('next')}>
                        <MonthSelectIcon name="chevron-right" />
                    </MonthSelectButtom>


                </MonthSelect>

                <ChartContainer>
                    <VictoryPie
                        data={totalbyCategories}
                        colorScale={totalbyCategories.map(category => category.color)}
                        style={{
                            labels: {
                                fontSize: RFValue(15),
                                alignContent: 'center',
                                fontWeight: 'bold',
                                fill: 'black',
                            }
                        }}
                        labelRadius={161}
                        x="percent"
                        y="total"
                    />
                </ChartContainer>


                {
                    totalbyCategories.map(item => (
                        <HistoryCard
                            key={item.key}
                            title={item.name}
                            amount={item.totalFormatted}
                            color={item.color}
                        />
                    ))
                }

            </Content>

        </Container>

    )
}