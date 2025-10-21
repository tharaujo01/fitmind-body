'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Camera,
  Save,
  Edit,
  Trophy,
  Target,
  Clock,
  Flame,
  Loader2
} from 'lucide-react';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserStats, 
  getWorkoutHistory,
  initializeUser,
  uploadProfileImage
} from '@/lib/profile';
import { UserProfile, UserStats, WorkoutHistory } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birth_date: '',
    profile_image: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Tentar carregar dados do localStorage primeiro (para compatibilidade)
      const localData = localStorage.getItem('userQuizData');
      let email = '';
      
      if (localData) {
        const parsed = JSON.parse(localData);
        email = parsed.email;
      }

      if (!email) {
        // Se não há email, criar um usuário demo
        email = 'demo@fitmind.com';
        const demoData = {
          name: 'Usuário Demo',
          email: email,
          birth_date: '1990-01-01',
          profile_image: ''
        };
        
        const { profile, stats: userStats } = await initializeUser(demoData);
        setProfileData(profile);
        setStats(userStats);
        setFormData({
          name: profile.name,
          email: profile.email,
          birth_date: profile.birth_date || '',
          profile_image: profile.profile_image || ''
        });
      } else {
        // Carregar dados do Supabase
        const profile = await getUserProfile(email);
        
        if (profile) {
          setProfileData(profile);
          setFormData({
            name: profile.name,
            email: profile.email,
            birth_date: profile.birth_date || '',
            profile_image: profile.profile_image || ''
          });

          // Carregar estatísticas
          const userStats = await getUserStats(profile.id);
          setStats(userStats);

          // Carregar histórico de treinos
          const history = await getWorkoutHistory(profile.id, 5);
          setWorkoutHistory(history);
        } else {
          // Criar novo usuário se não existir
          const newUserData = JSON.parse(localData);
          const { profile, stats: userStats } = await initializeUser({
            name: newUserData.name || 'Usuário',
            email: newUserData.email,
            birth_date: newUserData.birthDate || null,
            profile_image: newUserData.profileImage || null
          });
          
          setProfileData(profile);
          setStats(userStats);
          setFormData({
            name: profile.name,
            email: profile.email,
            birth_date: profile.birth_date || '',
            profile_image: profile.profile_image || ''
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      // Fallback para dados locais em caso de erro
      const localData = localStorage.getItem('userQuizData');
      if (localData) {
        const parsed = JSON.parse(localData);
        setFormData({
          name: parsed.name || '',
          email: parsed.email || '',
          birth_date: parsed.birthDate || '',
          profile_image: parsed.profileImage || ''
        });
      }
      
      // Stats simuladas em caso de erro
      setStats({
        id: 'demo',
        user_id: 'demo',
        workouts_completed: 15,
        total_points: 1250,
        current_streak: 7,
        total_calories: 8750,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profileData) return;
    
    try {
      setIsSaving(true);
      
      // Atualizar no Supabase
      const updatedProfile = await updateUserProfile(profileData.id, {
        name: formData.name,
        birth_date: formData.birth_date || null,
        profile_image: formData.profile_image || null
      });
      
      setProfileData(updatedProfile);
      
      // Atualizar localStorage para compatibilidade
      const localData = localStorage.getItem('userQuizData');
      if (localData) {
        const parsed = JSON.parse(localData);
        const updatedData = { 
          ...parsed, 
          name: formData.name,
          birthDate: formData.birth_date,
          profileImage: formData.profile_image
        };
        localStorage.setItem('userQuizData', JSON.stringify(updatedData));
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      // Fallback para localStorage
      const localData = localStorage.getItem('userQuizData');
      if (localData) {
        const parsed = JSON.parse(localData);
        const updatedData = { 
          ...parsed, 
          name: formData.name,
          birthDate: formData.birth_date,
          profileImage: formData.profile_image
        };
        localStorage.setItem('userQuizData', JSON.stringify(updatedData));
      }
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profileData) return;

    try {
      // Para demo, vamos usar FileReader para converter para base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          profile_image: imageUrl
        }));
      };
      reader.readAsDataURL(file);

      // Em produção, você usaria:
      // const imageUrl = await uploadProfileImage(file, profileData.id);
      // setFormData(prev => ({ ...prev, profile_image: imageUrl }));
      
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg">Carregando perfil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C0632] via-[#2D0A4A] to-[#FF4D22] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-10 h-10 bg-[#2A2A2A]/60 rounded-xl flex items-center justify-center text-white hover:bg-[#2A2A2A] transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-white font-bold text-xl">Meu Perfil</h1>
                <p className="text-white/60 text-sm">Gerencie suas informações pessoais</p>
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isSaving}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 ${
                isEditing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-[#FF4D22] text-white hover:bg-[#FF6B47]'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Profile Card */}
          <div className="bg-[#2A2A2A]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 bg-[#1A1A1A]/60 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.profile_image ? (
                    <img
                      src={formData.profile_image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white/40" />
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF4D22] rounded-full flex items-center justify-center hover:bg-[#FF6B47] transition-all duration-300"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1">Nome</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#1A1A1A]/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#FF4D22] focus:outline-none transition-all duration-300"
                    />
                  ) : (
                    <p className="text-white font-semibold text-xl">{formData.name || 'Nome não informado'}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-1">E-mail</label>
                    <p className="text-white">{formData.email || 'E-mail não informado'}</p>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm mb-1">Data de Nascimento</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                        className="w-full bg-[#1A1A1A]/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-[#FF4D22] focus:outline-none transition-all duration-300"
                      />
                    ) : (
                      <p className="text-white">{formatDate(formData.birth_date)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.workouts_completed || 0}</div>
              <div className="text-white/60 text-sm">Treinos Completados</div>
            </div>

            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <Target className="w-8 h-8 text-[#FF4D22] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.total_points || 0}</div>
              <div className="text-white/60 text-sm">Pontos Totais</div>
            </div>

            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.current_streak || 0}</div>
              <div className="text-white/60 text-sm">Sequência Atual</div>
            </div>

            <div className="bg-[#2A2A2A]/80 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.total_calories || 0}</div>
              <div className="text-white/60 text-sm">Calorias Queimadas</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#2A2A2A]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              {workoutHistory.length > 0 ? (
                workoutHistory.map((workout, index) => (
                  <div key={workout.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FF4D22]/20 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-[#FF4D22]" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{workout.exercise_name}</p>
                        <p className="text-white/60 text-sm">
                          {new Date(workout.completed_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">+{workout.points_earned} pts</span>
                  </div>
                ))
              ) : (
                // Atividades demo se não houver histórico
                <>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#FF4D22]/20 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-[#FF4D22]" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Flexão de Braço</p>
                        <p className="text-white/60 text-sm">Há 2 dias</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">+20 pts</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Treino HIIT Completo</p>
                        <p className="text-white/60 text-sm">Há 4 dias</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">+80 pts</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Sequência de 7 dias</p>
                        <p className="text-white/60 text-sm">Há 1 semana</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">+50 pts</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}