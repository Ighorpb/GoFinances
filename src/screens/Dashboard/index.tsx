import React from 'react';
import {
    Container, Header, UserWrapper, UserInfo, Photo, User, UserGreeting, UserName, Icon, HighlightCards

} from './styles'
import { HighlightCard } from '../../components/HighlighCard';

export function Dashboard() {
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

            <HighlightCards
               
            >
                <HighlightCard />
                <HighlightCard />
                <HighlightCard />
            </HighlightCards>
        </Container>
    )
}

