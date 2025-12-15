<template>
    <q-header elevated class="bg-primary text-secondary" >
      <q-toolbar> 
        <q-toolbar-title class="text-h5 text-bold text-center q-pt-sm">
          conserFAIRy
          <q-avatar size="50px">
            <img src="/icons/app_logo.png"/>
          </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs class="text-secondary float-left">
        <q-route-tab to="/" label="conserDUCTION" no-caps/>
        <q-route-tab to="/conserTABLE" label="conserTABLE" no-caps/>
        <q-route-tab to="/conserGRAPH" label="conserGRAPH" no-caps/>
      </q-tabs>
      <q-avatar class="float-right">
        <q-btn color="accent" label="login" text-color="secondary" no-caps flat />
      </q-avatar>
    </q-header>
</template>