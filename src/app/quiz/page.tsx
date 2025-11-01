              {/* Plano Personalizado */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">🎯 Seu plano personalizado está pronto!</h4>
                <p className="text-gray-700 mb-4">O seu plano Fit Mind Body inclui tudo o que você precisa para transformar seu corpo — treino, dieta personalizada, acompanhamento e evolução contínua.</p>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-600" />
                    <div>
                      <div className="font-semibold">Duração do Treino</div>
                      <div>{quizData.workoutDuration || '45 minutos ⏰'}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-purple-600" />
                    <div>
                      <div className="font-semibold">Nível de Aptidão</div>
                      <div>{quizData.fitnessLevel?.category || 'Amador'}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                    <div>
                      <div className="font-semibold">Local para Treinar</div>
                      <div>{quizData.workoutLocation || 'Academia'}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    <div>
                      <div className="font-semibold">Frequência de Treino</div>
                      <div>{quizData.trainingFrequency || '3 vezes por semana'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Os objetivos do seu programa também incluem:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {(quizData.additionalGoals || []).map((goal, index) => (
                      <li key={index}>• {goal}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-semibold text-gray-800 mb-2">O que você recebe:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Programa de treino personalizado</li>
                    <li>• 🥗 Dieta personalizada feita sob medida para o seu objetivo</li>
                    <li>• Plano de treino claro e fácil de seguir</li>
                    <li>• Resultados visíveis após o primeiro mês</li>
                    <li>• Acompanhamento e análise do progresso</li>
                  </ul>
                </div>

                {/* Dieta Personalizada */}
                {quizData.mealPlan && (
                  <div className="mt-6 bg-white/50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Utensils className="w-4 h-4 mr-2 text-green-600" />
                      Sua Dieta Personalizada
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {Object.entries(quizData.mealPlan).map(([category, items]) => (
                        <div key={category}>
                          <div className="font-semibold text-gray-700 mb-1">{category}:</div>
                          <div className="text-gray-600">
                            {Array.isArray(items) ? items.slice(0, 3).join(', ') + (items.length > 3 ? '...' : '') : 'Personalizado'}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {quizData.dietCreatedBy === 'FitMindBody' ? 
                        'Esta dieta foi criada automaticamente baseada nas suas respostas para otimizar seus resultados.' :
                        'Esta dieta foi personalizada com base nas suas preferências alimentares.'}
                    </p>
                  </div>
                )}
              </div>