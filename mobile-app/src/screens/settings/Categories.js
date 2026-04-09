import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Header from '../../components/layout/Header';
import CardContainer from '../../components/ui/CardContainer';
import MaggiButton from '../../components/ui/MaggiButton';
import MaggiInput from '../../components/ui/MaggiInput';
import MaggiAlert from '../../components/ui/MaggiAlert';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useCategories } from '../../context/CategoriesContext';

const ICON_OPTIONS = [
  '🍔', '🚗', '🏠', '💊', '🎬', '👕', '📚', '✈️',
  '🎵', '💻', '🏋️', '🐾', '🎁', '💰', '🔧', '◈',
];

const CategoryItem = ({ category, onToggle, onDelete }) => (
  <CardContainer variant="secondary" style={styles.categoryItem}>
    <View style={styles.categoryRow}>
      <View style={styles.categoryLeft}>
        <View style={styles.categoryIconContainer}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
        </View>
        <Text style={styles.categoryLabel}>{category.label}</Text>
      </View>
      <View style={styles.categoryRight}>
        <Switch
          value={category.active}
          onValueChange={() => onToggle(category.id)}
          trackColor={{
            false: colors.backgroundTertiary,
            true: colors.light,
          }}
          thumbColor={category.active ? colors.dark : colors.accent}
        />
        {!category.isDefault && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(category.id)}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </CardContainer>
);

const Categories = () => {
  const { user, logout } = useAuth();
  const { categories, addCategory, toggleCategory, deleteCategory } = useCategories();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('◈');
  const [nameError, setNameError] = useState('');
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'warning', buttons: null });
  const closeAlert = () => setAlertConfig(c => ({ ...c, visible: false }));

  const handleToggle = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );
  };

  const handleDelete = (id) => {
    setAlertConfig({
      visible: true,
      title: 'Eliminar categoría',
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      type: 'warning',
      buttons: [
        { text: 'Cancelar', style: 'cancel', onPress: closeAlert },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            closeAlert();
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
          },
        },
      ],
    });
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setNameError('El nombre es requerido');
      return;
    }
    if (categories.find(
      (c) => c.label.toLowerCase() === newCategoryName.toLowerCase()
    )) {
      setNameError('Esta categoría ya existe');
      return;
    }

    const newCategory = {
      id: Date.now().toString(),
      label: newCategoryName.trim(),
      icon: selectedIcon,
      active: true,
      isDefault: false,
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewCategoryName('');
    setSelectedIcon('◈');
    setNameError('');
    setShowAddModal(false);
  };

  const handleLogout = () => {
    setAlertConfig({
      visible: true,
      title: 'Cerrar sesión',
      message: '¿Estás seguro que quieres salir?',
      type: 'warning',
      buttons: [
        { text: 'Cancelar', style: 'cancel', onPress: closeAlert },
        { text: 'Salir', style: 'destructive', onPress: () => { closeAlert(); logout(); } },
      ],
    });
  };

  const activeCount = categories.filter((c) => c.active).length;

  return (
    <ScreenWrapper>
      <Header
        title="Configuración"
        showGreeting={false}
        showLogo={false}
      />

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Profile section */}
            <CardContainer variant="dark" style={styles.profileCard}>
              <View style={styles.profileRow}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>
                    {user?.email?.[0]?.toUpperCase() || 'M'}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileEmail}>
                    {user?.email || 'usuario@maggi.com'}
                  </Text>
                  <Text style={styles.profilePlan}>
                    MaggiBank Free
                  </Text>
                </View>
              </View>
            </CardContainer>

            {/* Categories header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categorías</Text>
              <Text style={styles.sectionCount}>
                {activeCount} activas
              </Text>
            </View>
          </>
        }
        ListFooterComponent={
          <>
            {/* Add category button */}
            <MaggiButton
              title="+ Nueva Categoría"
              variant="outline"
              onPress={() => setShowAddModal(true)}
              style={styles.addButton}
            />

            {/* Divider */}
            <View style={styles.divider} />

            {/* App info */}
            <CardContainer variant="secondary" style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Versión</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Modelo</Text>
                <Text style={styles.infoValue}>MaggiBank Free</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Motor Analytics</Text>
                <Text style={[styles.infoValue, { color: colors.success }]}>
                  Activo
                </Text>
              </View>
            </CardContainer>

            {/* Logout */}
            <MaggiButton
              title="Cerrar Sesión"
              variant="danger"
              onPress={handleLogout}
              style={styles.logoutButton}
            />

            <View style={styles.bottomPadding} />
          </>
        }
        renderItem={({ item }) => (
          <CategoryItem
            category={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      />

      <MaggiAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={closeAlert}
        buttons={alertConfig.buttons}
      />

      {/* Add Category Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setShowAddModal(false)}
            activeOpacity={1}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Nueva Categoría</Text>

            <MaggiInput
              label="Nombre"
              placeholder="Ej: Mascotas"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              error={nameError}
            />

            <Text style={styles.iconSelectorLabel}>ÍCONO</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    selectedIcon === icon && styles.iconOptionActive,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text style={styles.iconOptionText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <MaggiButton
                title="Cancelar"
                variant="outline"
                onPress={() => setShowAddModal(false)}
                style={styles.modalCancelButton}
              />
              <MaggiButton
                title="Crear"
                onPress={handleAddCategory}
                style={styles.modalCreateButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
    gap: 8,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  profileAvatarText: {
    ...typography.styles.h2,
    color: colors.textPrimary,
  },
  profileInfo: {
    flex: 1,
  },
  profileEmail: {
    ...typography.styles.body,
    color: colors.textPrimary,
  },
  profilePlan: {
    ...typography.styles.caption,
    color: colors.silver,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.styles.h3,
    color: colors.textPrimary,
  },
  sectionCount: {
    ...typography.styles.caption,
    color: colors.textSecondary,
  },
  categoryItem: {
    marginBottom: 0,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryLabel: {
    ...typography.styles.body,
    color: colors.textPrimary,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    ...typography.styles.caption,
    color: colors.error,
  },
  addButton: {
    marginTop: 8,
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.styles.bodySmall,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.styles.bodySmall,
    color: colors.textPrimary,
    fontFamily: typography.heading,
  },
  logoutButton: {
    width: '100%',
  },
  bottomPadding: {
    height: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  modalSheet: {
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    ...typography.styles.h2,
    color: colors.textPrimary,
    marginBottom: 24,
  },
  iconSelectorLabel: {
    ...typography.styles.label,
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconOptionActive: {
    backgroundColor: colors.light,
    borderColor: colors.light,
  },
  iconOptionText: {
    fontSize: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalCreateButton: {
    flex: 1,
  },
});

export default Categories;
