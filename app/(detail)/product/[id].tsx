// app/(detail)/product/[id].tsx
import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Text, ActivityIndicator, Button, Card, useTheme } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchProductById } from "../../../src/services/products";
import { Product } from "../../../src/screens/ProductsScreen";
import { Feather } from "@expo/vector-icons";

export default function ProductDetailScreen(): JSX.Element {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const theme = useTheme();
    const router = useRouter();

    useEffect(() => {
        if (id) {
            fetchProductById(id as string)
                .then((data: Product) => {
                    setProduct(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error al obtener el producto:", error);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.emptyContainer}>
                <Text>No se encontró el producto</Text>
                <Button
                    mode="contained"
                    onPress={() => router.back()}
                    style={styles.cartButton}
                >
                    Volver
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <Card style={styles.card}>
                <Image
                    source={{
                        uri: product.images && product.images.length > 0
                            ? product.images[0]
                            : "https://via.placeholder.com/150",
                    }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <Card.Content style={styles.contentContainer}>
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>

                    <View style={styles.badges}>
                        <View style={styles.stockBadge}>
                            <Text style={styles.stockText}>
                                Stock: {product.stock}
                            </Text>
                        </View>
                        {product.rating > 0 && (
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>
                                    ★ {product.rating.toFixed(1)}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.description}>
                        {product.description}
                    </Text>
                </Card.Content>

                <Card.Actions style={styles.actions}>
                    <Button
                        mode="text"
                        onPress={() => router.push('/products')}
                        style={styles.detailsButton}
                        labelStyle={styles.detailsButtonText}
                        icon={({ size, color }) => (
                            <Feather name="arrow-left" size={size} color={color} />
                        )}
                    >
                        Volver a Productos
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => router.push("/cart")}
                        style={styles.cartButton}
                        icon={({ size, color }) => (
                            <Feather name="shopping-cart" size={size} color={color} />
                        )}
                    >
                        Comprar
                    </Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: "#FAFAFA",
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        marginVertical: 16,
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
        backgroundColor: "#FFFFFF",
    },
    image: {
        width: "100%",
        height: 300,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    contentContainer: {
        padding: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#263238",
    },
    price: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
        color: "#4CAF50",
    },
    badges: {
        flexDirection: "row",
        marginBottom: 16,
    },
    stockBadge: {
        backgroundColor: "#E8F5E9", // Verde muy claro
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    stockText: {
        color: "#2E7D32", // Verde oscuro
        fontSize: 12,
        fontWeight: "500",
    },
    ratingBadge: {
        backgroundColor: "#FFF8E1", // Amarillo muy claro
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    ratingText: {
        color: "#FFA000", // Ámbar
        fontSize: 12,
        fontWeight: "500",
    },
    description: {
        fontSize: 16,
        color: "#455A64",
        marginTop: 8,
        lineHeight: 24,
    },
    actions: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },
    detailsButton: {
        marginRight: 8,
    },
    detailsButtonText: {
        color: "#455A64",
    },
    cartButton: {
        backgroundColor: "#4CAF50",
        borderRadius: 8,
    },
});