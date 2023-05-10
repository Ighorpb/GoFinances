import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HighlightCard } from '../../components/HighlighCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useFocusEffect } from '@react-navigation/native';
import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList

} from './styles'



export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expensive: HighlightProps;
    total: HighlightProps;
}
export function Dashboard() {

    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

    function getLastTransactionDate(
        collections: DataListProps[],
        type: 'positive' | 'negative'
    ) {
        const lastTransaction =
            Math.max.apply(Math, collections
                .filter(transaction => transaction.type === type)
                .map(transaction => new Date(transaction.date).getTime()));

        return Intl.
            DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(lastTransaction));

    }

    async function loadTransactions() {
        const dataKey = '@gofinance:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {

                if (item.type === 'positive') {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }

                const amount = Number(item.amount).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'

                });

                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));


                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date,
                }
            });

        setTransactions(transactionsFormatted)

        const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive')
        const lastTransactionsExpensive = getLastTransactionDate(transactions, 'negative')
        const totalInverval = `${lastTransactionsEntries} a ${lastTransactionsExpensive}`

        const total = entriesTotal - expensiveTotal

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Ultima entrada dia: ${lastTransactionsEntries}`,
            },
            expensive: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Ultima saída dia: ${lastTransactionsExpensive}`,

            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }),
                lastTransaction: `${totalInverval}`
            }
        });

    }

    useEffect(() => {
        loadTransactions();


    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{ uri: 'https://avatars.githubusercontent.com/u/69374770?v=4' }}
                        />
                        <User>
                            <UserGreeting> Olá, </UserGreeting>
                            <UserName>Ighor</UserName>
                        </User>

                    </UserInfo>
                    <Icon name="power" />

                </UserWrapper>

            </Header>

            <HighlightCards>
                <HighlightCard
                    type='up'
                    title='Entradas'
                    amount={highlightData.entries?.amount || '0'}
                    lastTransaction={highlightData.entries?.lastTransaction || '0'}
                />

                <HighlightCard
                    type='down'
                    title='Saídas'
                    amount={highlightData.expensive?.amount || '0'}
                    lastTransaction={highlightData.expensive?.lastTransaction || '0'}
                />

                <HighlightCard
                    type='total'
                    title='Total'
                    amount={highlightData.total?.amount || '0'}
                    lastTransaction={highlightData.total?.lastTransaction || '0'}
                />

            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>
                <TransactionsList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />

            </Transactions>

        </Container>
    )
}

