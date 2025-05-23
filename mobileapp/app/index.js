import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './dashboard';
import Register from './Register';
import Login from './login';
import CompetitionSignupList from './competition_signup_list';
import Ranking from './ranking/ranking';
import Forum from './forum/forum';
import React, { useEffect } from 'react';
import registerForPushNotificationsAsync from './forum/forum';
import Feedback_type from './feedback/feedback_type';
import Cheating_report from './feedback/cheating_report';
import Feedback from './feedback/feedback';
import Feedback_list from './feedback/feedback_list/feedback_list';
import Feedback_content from './feedback/feedback_list/feedback_content';
import Cheating_report_list from './feedback/cheating_report_list/cheating_report_list';
import Cheating_report_content from './feedback/cheating_report_list/cheating_report_content';

const Stack = createStackNavigator();

function App() {
 // useEffect(() => {
 //   registerForPushNotificationsAsync();
 // }, []);
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
        <Stack.Screen 
          name="Forum" 
          component={Forum}
          options={{ title: 'Forum' }}
        />
        <Stack.Screen 
          name="Feedback_type" 
          component={Feedback_type}
          options={{ title: 'Feedback_type' }}
        />
        <Stack.Screen 
          name="Cheating_report" 
          component={Cheating_report}
          options={{ title: 'Cheating_report' }}
       />
        <Stack.Screen 
          name="Feedback" 
          component={Feedback}
          options={{ title: 'Feedback' }}
        />
        <Stack.Screen 
          name="Feedback_list" 
          component={Feedback_list}
          options={{ title: 'Feedback_list' }}
        />
        <Stack.Screen 
          name="Feedback_content" 
          component={Feedback_content}
          options={{ title: 'Feedback_content' }}
        />
        <Stack.Screen 
          name="Cheating_report_list" 
          component={Cheating_report_list}
          options={{ title: 'Cheating_report_list' }}
        />
        <Stack.Screen 
          name="Cheating_report_content" 
          component={Cheating_report_content}
          options={{ title: 'Cheating_report_content' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);