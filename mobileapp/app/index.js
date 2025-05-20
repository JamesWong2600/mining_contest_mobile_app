import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './dashboard';
import Register from './Register';
import Login from './login';
import CompetitionSignupList from './competition_signup_list';
import Ranking from './ranking/ranking';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Register"
        screenOptions={{
          headerShown: false,  
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          
        }}
      >
        <Stack.Screen 
          name="Register" 
          component={Register}
          options={{ title: 'Create Account' }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard}
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="CompetitionSignupList" 
          component={CompetitionSignupList}
          options={{ title: 'CompetitionSignupList' }}
        />
        <Stack.Screen 
          name="Ranking" 
          component={Ranking}
          options={{ title: 'Ranking' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);