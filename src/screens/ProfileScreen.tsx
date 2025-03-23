// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar, Card, List, Divider, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Rutas
import { ROUTES } from '../constants/routes';

// Colores personalizados para tema de agricultura
const agriColors = {
    primary: '#2E7D32', // Verde oscuro
    secondary: '#81C784', // Verde claro
    background: '#F5F9F5', // Fondo ligeramente verde
    surface: '#FFFFFF',
    accent: '#33691E', // Verde intenso para acentos
    text: '#1B5E20', // Verde oscuro para texto
    placeholder: '#AED581', // Verde claro para placeholder
    lightBackground: '#E8F5E9', // Fondo verde muy claro para secciones
};

const ProfileScreen: React.FC = () => {
    const router = useRouter();
    const windowWidth = Dimensions.get('window').width;
    const isTablet = windowWidth > 768;

    const { user, logout } = useAuth();
    const [recentOrders, setRecentOrders] = useState([
        { id: '1', date: '15/03/2025', amount: '$150.00', status: 'Entregado' },
        { id: '2', date: '28/02/2025', amount: '$230.50', status: 'En proceso' },
    ]);
    const [favoriteProducts, setFavoriteProducts] = useState([
        { id: '1', name: 'Semillas de tomate orgánico', price: '$25.00' },
        { id: '2', name: 'Kit de jardinería premium', price: '$120.00' },
        { id: '3', name: 'Fertilizante natural', price: '$45.00' },
    ]);

    // Generar iniciales para el avatar
    const getInitials = () => {
        const firstName = user?.realName || '';
        const lastName = user?.lastName || '';
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={isTablet ? styles.tabletContentContainer : {}}
                showsVerticalScrollIndicator={false}
            >
                {/* Header con información del usuario */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Avatar.Text
                            size={80}
                            label={getInitials()}
                            style={[styles.avatar, { backgroundColor: agriColors.primary }]}
                            color='white'
                        />
                    </View>
                    <View style={styles.userInfoContainer}>
                        <Text style={styles.userName}>{user?.realName} {user?.lastName}</Text>
                        <Text style={styles.userDetail}>{user?.email}</Text>
                        <Text style={styles.userDetail}>{user?.phoneNumber || 'Sin teléfono registrado'}</Text>
                    </View>
                </View>

                <View style={isTablet ? styles.tabletLayout : {}}>
                    {/* Sección de acciones rápidas */}
                    <View style={[styles.section, isTablet ? styles.halfWidth : {}]}>
                        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
                        <View style={styles.quickActions}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/orders')}>
                                <View style={styles.actionIconContainer}>
                                    <IconButton icon="package-variant" size={28} iconColor="white" />
                                </View>
                                <Text style={styles.actionText}>Mis pedidos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/favorites')}>
                                <View style={styles.actionIconContainer}>
                                    <IconButton icon="heart" size={28} iconColor="white" />
                                </View>
                                <Text style={styles.actionText}>Favoritos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/settings')}>
                                <View style={styles.actionIconContainer}>
                                    <IconButton icon="cog" size={28} iconColor="white" />
                                </View>
                                <Text style={styles.actionText}>Configuración</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/address')}>
                                <View style={styles.actionIconContainer}>
                                    <IconButton icon="map-marker" size={28} iconColor="white" />
                                </View>
                                <Text style={styles.actionText}>Direcciones</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Sección de pedidos recientes */}
                    <View style={[styles.section, isTablet ? styles.halfWidth : {}]}>
                        <Text style={styles.sectionTitle}>Pedidos recientes</Text>
                        <Card style={styles.card}>
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order, index) => (
                                    <React.Fragment key={order.id}>
                                        <List.Item
                                            title={`Pedido #${order.id}`}
                                            description={`Fecha: ${order.date} • Total: ${order.amount}`}
                                            right={props => (
                                                <View style={styles.orderStatus}>
                                                    <Text style={[
                                                        styles.statusText,
                                                        order.status === 'Entregado' ? styles.deliveredStatus : styles.processingStatus
                                                    ]}>
                                                        {order.status}
                                                    </Text>
                                                </View>
                                            )}
                                            onPress={() => router.push(`/order/${order.id}`)}
                                            titleStyle={styles.orderTitle}
                                            descriptionStyle={styles.orderDescription}
                                            style={styles.listItem}
                                        />
                                        {index < recentOrders.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <List.Item
                                    title="No hay pedidos recientes"
                                    description="Los pedidos que realices aparecerán aquí"
                                    left={props => <List.Icon {...props} icon="information" color={agriColors.placeholder} />}
                                />
                            )}
                            <Button
                                mode="text"
                                onPress={() => router.push('/orders')}
                                style={styles.viewAllButton}
                                textColor={agriColors.primary}
                            >
                                Ver todos los pedidos
                            </Button>
                        </Card>
                    </View>

                    {/* Sección de productos favoritos */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Productos favoritos</Text>
                        <Card style={styles.card}>
                            {favoriteProducts.length > 0 ? (
                                favoriteProducts.map((product, index) => (
                                    <React.Fragment key={product.id}>
                                        <List.Item
                                            title={product.name}
                                            description={`Precio: ${product.price}`}
                                            left={props => (
                                                <View style={styles.favoriteProductIcon}>
                                                    <List.Icon {...props} icon="flower" color={agriColors.secondary} />
                                                </View>
                                            )}
                                            right={props => (
                                                <IconButton
                                                    icon="cart-plus"
                                                    size={20}
                                                    iconColor={agriColors.primary}
                                                    onPress={() => console.log('Añadir al carrito')}
                                                />
                                            )}
                                            onPress={() => router.push(`/product/${product.id}`)}
                                            titleStyle={styles.productTitle}
                                            descriptionStyle={styles.productDescription}
                                            style={styles.listItem}
                                        />
                                        {index < favoriteProducts.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <List.Item
                                    title="No tienes productos favoritos"
                                    description="Añade productos a favoritos para verlos aquí"
                                    left={props => <List.Icon {...props} icon="heart-outline" color={agriColors.placeholder} />}
                                />
                            )}
                            <Button
                                mode="text"
                                onPress={() => router.push('/favorites')}
                                style={styles.viewAllButton}
                                textColor={agriColors.primary}
                            >
                                Ver todos los favoritos
                            </Button>
                        </Card>
                    </View>

                    {/* Sección de soporte y ayuda */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Soporte y ayuda</Text>
                        <Card style={styles.card}>
                            <List.Item
                                title="Centro de ayuda"
                                left={props => <List.Icon {...props} icon="help-circle" color={agriColors.primary} />}
                                onPress={() => router.push('/help')}
                            />
                            <Divider />
                            <List.Item
                                title="Contactar soporte"
                                left={props => <List.Icon {...props} icon="headset" color={agriColors.primary} />}
                                onPress={() => router.push('/support')}
                            />
                            <Divider />
                            <List.Item
                                title="Preguntas frecuentes"
                                left={props => <List.Icon {...props} icon="frequently-asked-questions" color={agriColors.primary} />}
                                onPress={() => router.push('/faq')}
                            />
                        </Card>
                    </View>
                </View>

                {/* Botón de cerrar sesión */}
                <Button
                    mode="contained"
                    onPress={async () => {
                        if (typeof logout === 'function') {
                            await logout();
                        }
                        router.replace(ROUTES.LOGIN);
                    }}
                    style={styles.logoutButton}
                    contentStyle={styles.buttonContent}
                    buttonColor={agriColors.accent}
                >
                    Cerrar Sesión
                </Button>

                {/* Espacio adicional al final */}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: agriColors.background,
    },
    scrollView: {
        flex: 1,
    },
    tabletContentContainer: {
        paddingHorizontal: 24,
    },
    tabletLayout: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: agriColors.surface,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        borderWidth: 2,
        borderColor: agriColors.secondary,
    },
    userInfoContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: agriColors.text,
        marginBottom: 4,
    },
    userDetail: {
        fontSize: 14,
        color: agriColors.text,
        opacity: 0.7,
        marginBottom: 2,
    },
    section: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: agriColors.text,
        marginBottom: 12,
        marginTop: 8,
    },
    card: {
        backgroundColor: agriColors.surface,
        borderRadius: 12,
        overflow: 'hidden',
        borderLeftWidth: 4,
        borderLeftColor: agriColors.secondary,
    },
    listItem: {
        paddingVertical: 8,
    },
    orderTitle: {
        fontWeight: '600',
        color: agriColors.text,
    },
    orderDescription: {
        color: agriColors.text,
        opacity: 0.7,
    },
    orderStatus: {
        justifyContent: 'center',
    },
    statusText: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: '500',
    },
    deliveredStatus: {
        backgroundColor: '#E8F5E9',
        color: '#2E7D32',
    },
    processingStatus: {
        backgroundColor: '#FFF8E1',
        color: '#F57F17',
    },
    productTitle: {
        fontWeight: '600',
        color: agriColors.text,
    },
    productDescription: {
        color: agriColors.text,
        opacity: 0.7,
    },
    viewAllButton: {
        justifyContent: 'flex-start',
        marginLeft: 8,
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 8,
        backgroundColor: agriColors.surface,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionButton: {
        alignItems: 'center',
        width: '22%',
        marginBottom: 8,
    },
    actionIconContainer: {
        backgroundColor: agriColors.primary,
        borderRadius: 40,
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 12,
        color: agriColors.text,
        textAlign: 'center',
    },
    favoriteProductIcon: {
        justifyContent: 'center',
    },
    logoutButton: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    bottomPadding: {
        height: 32,
    },
});

export default ProfileScreen;