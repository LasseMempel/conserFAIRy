<!-- DialogueComponent.vue -->

<template>
    <q-dialog v-model="showIntroDialog" persistent>
      <q-card style="min-width: 400px; max-width: 600px;">
        <q-card-section class="bg-primary text-white row items-center q-pb-none">
          <div class="text-h6 q-pa-sm text-secondary">Willkommen auf der Mockup-App für Konservierungsdaten</div>
          <q-space />
        </q-card-section>
        <q-card-section class="q-pa-md text-secondary">
          <p>Dieses Tool dient der beispielhaften Erstellung strukturierter Daten zur Dokumentation von Konservierungs- und Restaurierungsprozessen. Grundlage hierfür ist ein Entwurf für einen Konservierungs- und Restaurierungs Metadatensatz.</p>
          <p>Dieser wurde von der Temporary Working Group <i>Community-Standards für kontrollierte Vokabulare und Austauschformate im Bereich der Erhaltung und Pflege des kulturellen Erbes</i> innerhalb des Konsortiums NFDI4Objects entwickelt.</p>
          <p><strong> Funktionen:</strong></p>
          <ul>
            <li><strong>Datenfelder:</strong> Geben Sie Informationen in die bereitgestellten Felder ein.</li>
            <li><strong>Verpflichtungsgrad:</strong> Farblich codierte Symbole zeigen den Verpflichtungsgrad an. 
              <ul>
                <li>Pflicht: <span class="text-red">*</span> </li> 
                <li>bedingte Pflicht (Pflicht, falls Daten bekannt): <span class="text-orange">*</span> </li>
                <li>Empfohlen: <span class="text-blue">°</span> </li>
                <li>Optional: <span class="text-gray">°</span> </li>
              </ul>
            </li>
            <li><strong>Kontrolliertes Vokabular:</strong> Baumstrukturen ermöglichen die Auswahl von Daten aus (simulierten) hierarchischen Normdaten.
            </li>
            <li><strong>Bestandsdaten:</strong> Exemplarische kuratorische Daten werden vorgeladen.</li>
            <li><strong>Validieren:</strong> Klicken Sie auf "Abschicken", um ihre Eingaben zu prüfen.</li>
            <li><strong>Hinweise:</strong> Fehlermeldungen weisen auf ausgelassene Pflichtfelder hin.</li>
            <li><strong>Datengenerierung:</strong> Nach erfolgreicher Validierung werden strukturierte Daten erstellt.</li>
            <li><strong>Export:</strong> Diese lassen sich im JSON oder XML-Format kopieren und herunterladen.</li>
            <li><strong>Keine Zeit?:</strong> Nutzen Sie den Knopf <i>Felder</i> ausfüllen, um das komplette Formular mit Beispieldaten zu laden und dann abzuschicken.</li>
            <li><strong>Helfer:</strong> <i>Ausklappen</i> und <i>Einklappen</i> für die Übersicht, sowie <i>Zurücksetzen</i> zum Leeren des Formulars.</li>
            <li><strong>Minimalmetadatensatz:</strong> Anzeige nur verpflichtender Felder. Der Knopf <i>Erweiterter Datensatz</i> macht empfohlene und optionale Felder ebenfalls sichtbar.  </li>
          </ul>
          <p>Beginnen Sie, indem Sie die benötigten Abschnitte <b>Zustandserfassung</b> und <b>Konservierungskonzept</b> ausfüllen. Anschließend auf <i>Abschicken</i> klicken.</p>
          <p>Eingegebene Daten werden nicht gespeichert.</p>
        </q-card-section>
        <q-card-actions align="right" class="q-pr-md q-pb-md">
          <q-btn
            label="Verstanden"
            color="accent"
            text-color="secondary"
            @click="
              showIntroDialog = false;
            "
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup>
    import { ref } from 'vue';
    const showIntroDialog = ref(true);
</script>