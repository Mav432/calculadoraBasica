import { Stack } from "expo-router";

const Layout=()=>{
    return(
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="/index" />
            <Stack.Screen name="/propiedades" />
            <Stack.Screen name="/(tabs)/" />
            <Stack.Screen name="/productos/:id" options={{headerShown:true}}/>
        </Stack>
    )
}

export default Layout;