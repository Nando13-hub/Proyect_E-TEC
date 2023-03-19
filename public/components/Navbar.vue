<template>
    <b-navbar type="dark" variant="dark" fixed="top">
        <b-navbar-brand href="#">My Store</b-navbar-brand>
        <b-navbar-nav>
            <b-nav-item href="#">Inicio</b-nav-item>
            <b-nav-item href="#">Productos</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
            <b-nav-item href="#">Mi cuenta</b-nav-item>
            <b-nav-item href="#">Carrito</b-nav-item>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
    export default {
        name: 'Navbar'
    };
</script>