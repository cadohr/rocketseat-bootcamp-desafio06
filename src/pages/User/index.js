import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  ViewButton,
} from './styles';

export default class User extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: false,
  };

  async componentDidMount() {
    const { route } = this.props;
    const user = route.params?.user;

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  handleRepoView = async repo => {
    const { navigation } = this.props;
    console.tron.log(navigation);

    navigation.navigate('Repository', repo);
  };

  loadMore = async () => {
    const { route } = this.props;
    const user = route.params?.user;

    const { page } = this.state;

    this.setState({ loading: true });

    const response = await api.get(
      `/users/${user.login}/starred?page=${page + 1}`
    );

    this.setState({ stars: response.data, page: page + 1, loading: false });
  };

  refreshList = async () => {
    const { route } = this.props;
    const user = route.params?.user;

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred?page=1`);

    this.setState({ stars: response.data, page: 1, loading: false });
  };

  render() {
    const { route } = this.props;
    const { stars, loading } = this.state;

    const user = route.params?.user;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator size="large" color="#7159c1" />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.login}</Author>
                  <ViewButton onPress={() => this.handleRepoView(item)}>
                    <Icon name="pageview" size={36} />
                  </ViewButton>
                </Info>
              </Starred>
            )}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={this.state.loading}
          />
        )}
      </Container>
    );
  }
}
